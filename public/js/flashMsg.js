// Flash message handling
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event fired')
    // Select the success and error message elements
    var successMsg = document.querySelector('.alert.alert-success');
    var errorMsg = document.querySelector('.alert.alert-danger');

    console.log(`successMsg : ${successMsg}`);
    console.log(`errorMsg : ${errorMsg}`);

    // Hide success message after 2000 milliseconds (2 seconds) if it's present
    if (successMsg && successMsg.textContent.trim() !== '') {
        setTimeout(function () {
            successMsg.style.display = 'none';
        }, 2000);
    }
    else{
        successMsg.style.display = 'none';
    }

    // Hide error message after 2000 milliseconds (2 seconds) if it's present
    if (errorMsg && errorMsg.textContent.trim() !== '') {
        setTimeout(function () {
            errorMsg.style.display = 'none';
        }, 2000);
    }
    else{
        errorMsg.style.display = 'none';
    }
});
