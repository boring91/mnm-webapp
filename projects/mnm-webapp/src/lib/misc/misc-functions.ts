export const miscFunctions = {

    objectToURLParams: function (obj: any) {
        let params = '';
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                let value = obj[key];

                if (value instanceof Array) {
                    for (let i = 0; i < value.length; i++) {
                        params = `${params}${encodeURIComponent(key)}=${encodeURIComponent(value[i])}&`;
                    }
                } else if (value instanceof Object) {
                    for (const childKey in value) {
                        if (value.hasOwnProperty(childKey)) {
                            params = `${params}${encodeURIComponent(`${key}[${childKey}]`)}=` +
                                `${encodeURIComponent(value[childKey])}&`;
                        }
                    }
                } else {
                    if (!value) {
                        value = '';
                    }
                    params = `${params}${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
                }
            }
        }
        return params.slice(0, params.length - 1);
    },

    setCookie: function (name: string, value: string, expires?: Date) {
        let cookie = `${name}=${encodeURIComponent(value)}`;
        if (expires) {
            cookie += `; expires=${expires.toUTCString()}`;
        }
        // '; expires=' + d.toUTCString() +
        cookie += '; path=/';

        document.cookie = cookie;
    },

    getCookie: function (name: string): string {
        const cookies = document.cookie.split('; ').map(x => {
            const tokens = x.split('=');
            const obj = {};
            obj[decodeURIComponent(tokens[0])] = decodeURIComponent(tokens[1]);
            return obj;
        }).reduce((a, b) => Object.assign(a, b));
        return cookies[name];
    },

    deleteCookie: function (name: string) {
        miscFunctions.setCookie(name, '', new Date('Thu, 01 Jan 1970 00:00:01 GMT'));
    },

    uuid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4();
    },

    offset: function (el: HTMLElement) {
        const rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return {top: rect.top + scrollTop, left: rect.left + scrollLeft};
    },

    getEmptyObject: function (obj: any = {}): any {
        return obj;
    },

    getEmptyObjects: function (n: number): any[] {
        const arr = [];
        for (let i = 0; i < n; i++) {
            arr.push({});
        }
        return arr;
    },

    includeOnly: function (obj: any, ...fields): any {
        const newObj = {};
        fields.forEach(field => newObj[field] = obj[field]);
        return newObj;
    },

    getScrollTop: () => window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,

    validators: {
        email: function (email): boolean {
            const re = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))' +
                '@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
            return re.test(email);
        }
    }
};
