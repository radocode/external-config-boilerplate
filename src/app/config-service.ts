import { Injectable, APP_INITIALIZER } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class ConfigService {

    private config: any;
    private env: string;

    constructor(private http: HttpClient) { }
    load() {
        return new Promise((resolve) => {
            this.env = 'development';
            if (environment.production) {
                this.env = 'production';
            }
            console.log(this.env);
            this.http.get('./assets/config/' + this.env + '.json')
                .subscribe((data) => {
                    this.config = data;
                    resolve(true);
                },
                (error: any) => {
                    console.error(error);
                    throwError(error.json().error || 'Server error');
                });
        });
    }
    // Is app in the development mode?
    isDevmode() {
        return this.env === 'development';
    }
    // Gets API route based on the provided key
    getApi(key: string): string {
        return this.config.API_ENDPOINTS[key];
    }
    // Gets a value of specified property in the configuration file
    get(key: any) {
        return this.config[key];
    }
}

export function ConfigFactory(config: ConfigService) {
    return () => config.load();
}

export function init() {
    return {
        provide: APP_INITIALIZER,
        useFactory: ConfigFactory,
        deps: [ConfigService],
        multi: true
    };
}

const ConfigModule = {
    init
};

export { ConfigModule };
