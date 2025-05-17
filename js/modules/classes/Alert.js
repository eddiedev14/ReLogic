class Alert{
    showAlert(title, text, icon){
        Swal.fire({
            title: title,
            text: text,
            icon: icon
        });
    }
}

export default new Alert();