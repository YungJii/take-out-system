
let imgUpload = () => {
    return new Promise(function(resolve, reject) {
        // ... some code
        if (document.getElementById("choose")) {
            resolve(document.getElementById("choose"))
        } else {
            reject();
        }
    });
}

export default imgUpload;