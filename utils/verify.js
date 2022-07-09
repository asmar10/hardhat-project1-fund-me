const { run } = require("hardhat");

async function verify(contractAddress, args) {
    console.log("Verifying your contract .....")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
        console.log("Verification done");
    } catch (e) {
        if (e.message.toLowerCase() == "already verified") {
            console.log("Already Verified");
        } else {
            console.log(e);
        }
    }
}
module.exports = { verify };
