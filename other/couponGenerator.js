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
        { address : '0xdd0D77E16c6F44cB9Aa38891ccae3954DEa8bC2A', qty : 1},
        { address : '0xD105a0cD7fA1Ad4C9E3af25a0824F2E9aE081782', qty : 1},
        { address : '0xf5e473aCCc380099212FF72f9A2A0e52C1307707', qty : 1},
        { address : '0x000a22cdB94eFBB7260aD038E1b2d377D950ED78', qty : 1},
        { address : '0x0e559fdBf4a6E2c10dCB284DEe2F094ec50dB5b3', qty : 1},
        { address : '0x9Beba0d0F2cB869984fDA0549c626223743FE591', qty : 1},
        { address : '0x89429fA0415BBB9c7ad8347ef01c6E3C9bf424b8', qty : 1},
        { address : '0x17E119330a8fcF0a93E0f90725527b3F910fa032', qty : 1},
        { address : '0x1d4DBC735129CCDe7094554e11eec184FC63ab47', qty : 1},
        { address : '0xa6540681FE688179222FA8c96D96D2353106a7a3', qty : 1},
        { address : '0x0A46E2FFE674d2132B80C90e26d0b30460860E3D', qty : 1},
        { address : '0x779357013550e61Bcda605bd0D11cB292e0978E7', qty : 1},
        { address : '0xCd43AdcB61949ab14D3f4574BFbDA53d46389715', qty : 1},
        { address : '0xa7531F5A9D56089A79EBCb295bAba41bED80ca22', qty : 1},
        { address : '0x1f00179E7ea87976938F77d2febc2440E2c9ffA6', qty : 1}      
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