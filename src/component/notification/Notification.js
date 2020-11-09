import {toast} from "react-toastify";

function createError(message) {
    console.log(message);
    debugger
    toast.warn(`错误 ${message}`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
    });
}

function createSuccess(message) {
    toast.success(message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
    });
}

function createInfo(message) {
    toast.info(message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
    });
}

function createWarn(message) {
    toast.warn(message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
    });
}



export {
    createError,
    createInfo,
    createSuccess,
    createWarn,
}
