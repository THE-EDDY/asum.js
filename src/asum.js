function asum_ajax(obj, ddata = null, method = 'GET', link = null, callback = undefined) {
    event.preventDefault();

    let old_text = obj.innerHTML;
    obj.innerHTML = "<i class='fas fa-circle-notch fa-spin'></i>";

    if(link === null) {
        var href = obj.getAttribute('href');
    }else{
        var href = link;
    }

    $.ajax({
        type: method,
        url: href,
        data: ddata,
        cache: false,
        processData: false,
        success: function (data) {

            if (data.status === 'success') {

                obj.innerHTML = "<i class='fas fa-check'></i>";
                setTimeout(function () {
                    obj.innerHTML = old_text;
                }, 1000);

                if (data.redirect !== undefined) {
                    setTimeout(
                        function () {
                            window.top.location = data.redirect
                        }, 3000);
                }

                if (data.download !== undefined) {
                    window.top.location = data.download
                }

                if (data.refresh === true) {
                    setTimeout(location.reload(), 4000);
                }

                if (callback !== undefined) {
                    window[callback](data.callback_data);
                }

            } else if (data.status === 'error') {

                obj.innerHTML = "<i class='fas fa-times'></i>";
                setTimeout(function () {
                    obj.innerHTML = old_text;
                }, 1000);

                ealert.fire("error", data.message, "Error");

            }

        },
        error: function (data) {
            ealert.fire("error", data, "Error");
        }
    });

}

$(document).delegate('form', 'submit', function (event) {


    let form = $(this),
        data = form.serialize(),
        method = form.attr("method"),
        feedback = form.attr("feedback"),
        form_id = form.attr("id"),
        action = form.attr('action'),
        enctype = form.attr('enctype'),
        verify = form.attr('verify'),
        direct = form.attr('direct'),
        reset = form.attr('reset'),
        form_alert = form.attr('alert'),
        callback = form.attr('callback'),
        proceed = false;

    if (direct === 'true') {
        return true;

    } else {
        event.preventDefault();


        ealert.fire('info', 'Processing your request. Please wait.');

    }


    async function ConfirmPassword() {

        if (verify === 'true') {
            const {value: password} = await Swal.fire({
                title: '<h4>Enter your password</h4>',
                input: 'password',
                inputPlaceholder: 'Enter your password',
                inputAttributes: {
                    maxlength: 10,
                    autocapitalize: 'off',
                    autocorrect: 'off'
                },
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                footer: '<span class="font-gray font-xs text-center">We need you to authorize this action by providing your account password.' +
                    'This is a safety measure to protect your account</span>',

            });
            if (password) {
                await $.ajax({
                    type: 'POST',
                    url: base_url + '/user/password_check',
                    data: 'pass=' + password, // serializes the form's elements.
                    cache: false,             // To unable request pages to be cached
                    processData: false,        // To send DOMDocument or non processed data file it is set to false
                    success: function (response) {

                        if (response.status === true) {

                            swal.fire("Processing", "Processing your request. Please wait...", "info");
                            proceed = true;
                            return true;

                        } else if (response.status === false) {
                            swal.fire('Incorrect Password', '', 'error');
                            proceed = false;
                            return false;
                        }
                    },
                    error: function (xhr, tst, err) {
                        alert('XHR ERROR ' + XMLHttpRequest.status);
                    },
                });


            }
        } else {
            proceed = true;
            return true;
        }
    }


    async function ProcessFunction() {
        await ConfirmPassword();

        if (proceed === true) {

            if (action === null) {
                action = window.location.href;
            }

            if (enctype === undefined) {

                $.ajax({
                    type: method,
                    url: action,
                    data: data, // serializes the form's elements.
                    cache: false,             // To unable request pages to be cached
                    processData: false,        // To send DOMDocument or non processed data file it is set to false
                    success: function (data) {

                        if (data.status === 'success') {

                            if(feedback !== 'false') {
                                if (form_alert === undefined) {
                                    swal("Success", data.message, "success");
                                } else if (form_alert === 'ealert') {
                                    ealert.fire('success', data.message);
                                }
                            }

                            if (data.redirect !== undefined) {
                                setTimeout(
                                    function () {
                                        window.top.location = data.redirect
                                    }
                                    , 3000);

                            }

                            if (data.refresh === true) {
                                setTimeout(location.reload(), 4000);
                            }

                            if (data.download !== undefined) {
                                window.top.location = data.download
                            }

                            if (callback !== undefined) {
                                window[callback](data.callback_data);
                            }


                        } else if (data.status === 'error') {

                            swal("Error", data.message, "error");
                        }


                    },
                    error: function (data) {

                        ealert.fire('error', data);
                    }
                });

                if(reset === true) {
                    form.trigger("reset");
                }


            } else {

                var formData = document.getElementById(form_id);

                $.ajax({
                    url: action, // Url to which the request is send
                    type: method,             // Type of request to be send, called as method
                    data: new FormData(formData), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
                    enctype: 'multipart/form-data',
                    contentType: false,       // The content type used when sending data to the server.
                    cache: false,             // To unable request pages to be cached
                    processData: false,        // To send DOMDocument or non processed data file it is set to false
                    beforeSend: function () {

                        if (form_alert === undefined) {
                            swal("Success", 'Uploading file', "success");
                        } else if (form_alert === 'ealert') {
                            ealert.fire('success', 'Uploading file');
                        }
                    },
                    success: function (data)   // A function to be called if request succeeds
                    {
                        if (data.status === 'success') {

                            if (form_alert === undefined) {
                                swal("Success", data.message, "success");
                            } else if (form_alert === 'ealert') {
                                ealert.fire('success', data.message);
                            }

                            if (data.redirect !== undefined) {
                                setTimeout(
                                    function () {
                                        window.top.location = data.redirect
                                    }
                                    , 3000);

                            }

                            if (data.refresh === true) {
                                setTimeout(location.reload(), 4000);
                            }

                            if (data.download !== undefined) {
                                window.top.location = data.download
                            }

                            if (callback !== undefined) {
                                window[callback](data.callback_data);
                            }


                        } else if (data.status === 'error') {

                            swal("Error", data.message, "error");
                        }

                        if(reset === true) {
                            form.trigger("reset");
                        }


                    },
                    error: function (request, status, error) {

                        ealert.fire('success', request.responseText);
                    }
                });


            }

        }

    }

    ProcessFunction();


});