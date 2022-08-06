//npx hardhat run .\other\couponGenerator.js 
const { ethers } = require("hardhat");
const fs = require("fs");

  
const {
    keccak256,
    toBuffer,
    ecsign,
    bufferToHex,
} = require("ethereumjs-utils");

let signerPvtKey1 = process.env.SigPK;

//const signerPvtKey = Buffer.from(signerPvtKey1.substring(2,66), "hex");
const signerPvtKey = Buffer.from(signerPvtKey1, "hex");


let coupons = {};

async function getClaimCodes() {
    //const [owner, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20] = await ethers.getSigners();

    let presaleAddresses = [
        { address : '0xCd43AdcB61949ab14D3f4574BFbDA53d46389715', qty : 10},
        { address : '0xe1EfD96423b310E45b7629e1c9d8a6a7B83d34ea', qty : 10},
        { address : '0x04DF4282EE9EAE905748e2270b65730F0dE9E0C9', qty : 10},
        { address : '0x538ad846530fD23aD4210c31A33929811C9A1A47', qty : 20},
        { address : '0xDaC57cbe46D324c0E7e463EC735a10253788AB08', qty : 2},
        { address : '0x46a25FC838F464df0719a541780bB7bE7BBC5a74', qty : 10},
        { address : '0x6b6bA3De0D88bB1137dA5c58874812A7BeaEd4a4', qty : 10}      
    ]      
    
    function createCoupon(hash, signerPvtKey) {
        return ecsign(hash, signerPvtKey);
    }
    
    function generateHashBuffer(typesArray, valueArray) {
        return keccak256(
            toBuffer(ethers.utils.defaultAbiCoder.encode(typesArray,
                valueArray))
        );
    }

    function serializeCoupon(coupon) {
        return {
            r: bufferToHex(coupon.r),
            s: bufferToHex(coupon.s),
            v: coupon.v
        };
    }

    for (let i = 0; i < presaleAddresses.length; i++) {
        const userAddress = ethers.utils.getAddress(presaleAddresses[i].address);
        const hashBuffer = generateHashBuffer(
            ["uint256", "address"],
            [presaleAddresses[i].qty, userAddress]
        );
        const coupon = createCoupon(hashBuffer, signerPvtKey);

        coupons[userAddress] = {
            q : presaleAddresses[i].qty,
            whitelistClaimPass: serializeCoupon(coupon)
        };
    }
    // HELPER FUNCTIONS
    
    // get the Console class
    const { Console } = require("console");
    // get fs module for creating write streams
    const fs = require("fs");

    // make a new logger
    const myLogger = new Console({
    stdout: fs.createWriteStream("ProjectWhitelist-signed-coupons.txt"),
    stderr: fs.createWriteStream("errStdErr.txt"),
    });

    myLogger.log(coupons);
   
}

getClaimCodes()