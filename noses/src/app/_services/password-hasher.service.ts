import { Injectable } from '@angular/core';
import { promisify } from 'util';
// import { bcrypt } from 'bcrypt';
// const bcrypt = require('bcrypt');


@Injectable({
    providedIn: 'root'
})
export class PasswordHasherService {

    public globalCost: number = 15;
    

    constructor() { }

    async hashPassword(password: string) {
        

        // const salt = await promisify(bcrypt.genSalt)(this.globalCost);
        // const hash = await promisify(bcrypt.hash)(password, salt);
        // console.log("created hash: " + hash.toString());
        // return hash;

        return "";
    }
}
