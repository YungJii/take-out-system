
let imgUpload = () => {
    var filechooser
    let promise = new Promise((resolve, reject) => {
        // console.log('Promise');
        // var input = document.createElement('input')
        // input.type = 'file'
        // input.id = 'choose'
        // input.capture = 'camera'
        // input.accept="image/*"
        resolve();
    });

    promise.then(() => {
        filechooser = document.getElementById("choose");
    })

    promise.then(() => {
        filechooser.click()
    })
    
}
export default imgUpload;