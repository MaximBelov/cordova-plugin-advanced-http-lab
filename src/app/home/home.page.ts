import { Component, Injector, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { File, FileEntry, FileError } from '@awesome-cordova-plugins/file/ngx';
import { HTTP } from 'awesome-cordova-plugins-http/ngx';
import { BehaviorSubject } from 'rxjs';

declare var window: Window & {
    cordova: {
        plugin: {
            http:
                {
                    downloadFile(url: string, body: object, headers: object, filePath: string, onSuccess: any, onFailure: any, progress?: any): void;
                    uploadFile(url: string, body: object, headers: object, filePath: string, fileName: string, onSuccess: any, onFailure: any, progress?: any): void;
                }
        }
    }
};

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    public downloadUrl = 'api/50MB.zip';
    // http://xcal1.vodafone.co.uk/
    public downloadUrlNative = 'http://212.183.159.230/5MB.zip';
    public filesDirectory: string;
    public tempDirectory: string;
    public progressDownload = new BehaviorSubject({});
    public progressUpload = new BehaviorSubject({});
    private readonly file = this.injector.get(File);
    public readonly http = this.injector.get(HttpClient);
    private readonly httpNative = this.injector.get(HTTP);
    private readonly platform = this.injector.get(Platform);
    private readonly changeDetectorRef = this.injector.get(ChangeDetectorRef);

    constructor(private injector: Injector) {
        this.platform
            .ready()
            .then(() => {
                if (this.platform.is('cordova')) {
                    this.filesDirectory = this.file.dataDirectory + 'files/';
                    this.tempDirectory = this.platform.is('ios') ? this.file.tempDirectory : this.file.cacheDirectory;
                }
            })
            .catch((error) => {
                throw error;
            });
    }

    async downloadFile(){
        const url = this.platform.is('cordova') ? this.downloadUrlNative : this.downloadUrl;
        const result = await this.getRemoteFileData(url)
        console.log(result);
    }

    async getRemoteFileData(url: string) {
        if(!this.platform.is('cordova')){
            return this.http.get(url, { responseType: 'arraybuffer', reportProgress: true }).toPromise();
        }


        const nativeHttpResponse = await this.httpNative.sendRequest(url, {
            method: 'download',
            params: {},
            headers: {},
            filePath: `${this.file.dataDirectory}/update.zip`,
            onProgress: (progressData) => {
                this.progressDownload.next(progressData);
                this.changeDetectorRef.detectChanges();

                console.log((progressData.transferred / progressData.total * 100) + ' percent complete')
            }
        });
        console.log(nativeHttpResponse);
    }

    async uploadFile(){
        const nativeHttpResponse = await this.httpNative.sendRequest(
            'https://httpbin.org/post',
            {
                method: 'upload',
                params: {},
                headers: {},
                filePath: `${this.file.dataDirectory}/update.zip`,
                name: 'update.zip',
                onProgress: (progressData) => {
                    this.progressUpload.next(progressData);
                    this.changeDetectorRef.detectChanges();
                    console.log((progressData.transferred / progressData.total * 100) + ' percent complete')
                }
            }
        );
        console.log(nativeHttpResponse);
    }

}
