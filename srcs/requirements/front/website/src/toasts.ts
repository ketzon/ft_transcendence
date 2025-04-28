import Toastify from 'toastify-js'

export const toasts = {
    error(message: string) {
        Toastify({
            text: message,
            duration: 2000,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: false, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #ED213A, #93291E)",
              borderRadius: "10px"
            },
            // onClick: function(){} // Callback after click
          }).showToast();
    },

    success(message:string): void {
        Toastify({
            text: message,
            duration: 2000,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: false, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
              borderRadius: "10px"
            },
            // onClick: function(){} // Callback after click
          }).showToast();
    }
}
