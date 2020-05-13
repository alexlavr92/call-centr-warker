jQuery(document).ready(function ($) {

    var authCode;
    var DocWidth = $(document).width()
    AOS.init({});

    /* Function Block Scroll */
    var blockScroll = function (state) {
        if (state == "open") {
            setTimeout(function () {

                if (!document.body.hasAttribute('data-body-scroll-fix')) {

                    let scrollPosition = window.pageYOffset || document.documentElement.scrollTop; // Получаем позицию прокрутки

                    document.body.setAttribute('data-body-scroll-fix', scrollPosition); // Cтавим атрибут со значением прокрутки
                    document.body.style.overflow = 'hidden';
                    document.body.style.position = 'fixed';
                    document.body.style.top = '-' + scrollPosition + 'px';
                    document.body.style.left = '0';
                    document.body.style.right = '0';
                }

            }, 10);
        }
        if (state == "close") {
            if (document.body.hasAttribute('data-body-scroll-fix')) {

                let scrollPosition = document.body.getAttribute('data-body-scroll-fix'); // Получаем позицию прокрутки из атрибута

                document.body.removeAttribute('data-body-scroll-fix'); // Удаляем атрибут
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';

                window.scroll(0, scrollPosition); // Прокручиваем на полученное из атрибута значение

            }
        }
    }
    //----------------------//


    // Init Mask Phone //
    function initPhoneMask() {
        if ($('.input-phone').length > 0) {
            $(".input-phone").inputmask({
                showMaskOnHover: false,
                mask: "+7   (999)-999-99-99"
            });
        }
    }
    initPhoneMask()
    //----------------------//


    // Init Mask Text //
    function initTextMask() {
        if ($('html:not(.android) .input-text').length > 0) {
            $("html:not(.android) .input-text").inputmask({
                showMaskOnHover: false,
                regex: "[a-zA-Zа-яА-Я]*",
            });
        }
    }
    initTextMask()
    //----------------------//

    // Init Mask E-Mail //
    function initEmailMask() {
        if ($('html:not(.android) .input-email').length > 0) {
            $("html:not(.android) .input-email").inputmask("email")
        }
    }
    initEmailMask()
    //----------------------//

    // Init Mask Four Number //
    function initFourMask() {
        if ($('.input-four').length > 0) {
            $(".input-four").inputmask({
                mask: "9999",
                showMaskOnHover: false
            })
        }
    }
    initFourMask()
    //----------------------//

    // Edit type input in input-email //
    if ($('html.android .input-email').length > 0) {
        $('html.android .input-email').each(function (index, elem) {
            $(elem).attr('type', 'email')
        })
    }
    //----------------------//

    // Function Accept FileInputs //
    var CheckFileInputs = function () {
        var CountEmptyElem = 0,
            AllInputFiles = $('.step_wrapper:first-child input[type="file"]')
        AllInputFiles.each(function (index, elem) {
            if ($(elem).val() == '')
                CountEmptyElem = CountEmptyElem + 1
        })
        if (CountEmptyElem == 0 && $('.step_wrapper:first-child .invalid').length == 0)
            $('.form-steps_wrapper .submit-btn').removeClass('disabled').attr('disabled', false)
        else {
            $('.form-steps_wrapper .submit-btn').addClass('disabled').attr('disabled', true)
        }
    }
    //----------------------//

    // Function Remove Invalid Text and Invalid Class from inputs[file] //
    var RemoveInvalidFileInput = function ($this) {
        if ($this.siblings('.invalid-text').length > 0)
            $this.siblings('.invalid-text').remove()
        if ($this.siblings('.label-default.invalid')) {
            $this.siblings('.label-default.invalid').removeClass('invalid')
        }
    }
    //----------------------//

    // Hendler change input with type="file" //
    $('body').on('change', 'input[type="file"]', function (e) {
        NowInputText = $(this).next('.label-default').find('.label-default-file')
        if (!NowInputText.attr('now-text'))
            NowInputText.attr('now-text', NowInputText.text())
        if ($(this).val() != '') {
            if (this.files[0].size > 2097152) {
                var InvalidText = "<span class='invalid-text'>Загрузите файл размером не более 2мб</span>"
                $(this).siblings('.invalid-text').remove()
                $(InvalidText).insertAfter($(this).siblings('.label-default'))
                $(this).siblings('.label-default').addClass('invalid')
            }
            else if (!this.files[0].type.match(/(.png)|(.jpeg)|(.jpg)|(.gif)|(.pdf)$/i)) {
                var InvalidText = "<span class='invalid-text'>Загрузите файл в формате png, jpeg, jpg, gif, pdf</span>"
                $(this).siblings('.invalid-text').remove()
                $(InvalidText).insertAfter($(this).siblings('.label-default'))
                $(this).siblings('.label-default').addClass('invalid')
            }
            else {
                RemoveInvalidFileInput($(this))
            }
            NowInputText.text(this.files[0].name)
        }
        else {
            NowInputText.text(NowInputText.attr('now-text'))
            RemoveInvalidFileInput($(this))
        }
        CheckFileInputs()
    })
    //----------------------//

    /* Submit Form Steps */
    var NowSubmitBtnText
    var FormStepsSubmitBtn
    $('body').on('submit', '.form-steps_block', function (e) {
        if ($(this).find('.step_wrapper.open').index() == 0) {
            $(this).css({
                'min-height': $(this).innerHeight()
            })
            $(this).find('.step_wrapper.open').removeClass('open').hide().next('.step_wrapper').fadeIn().addClass('open')
            $(this).siblings('.steps_wrapper').find('.step_current').hide().text('2').fadeIn()
            NowSubmitBtnText = $(this).siblings('.submit-btn_wrapper').find('.submit-btn').text()
            $(this).siblings('.submit-btn_wrapper').find('.submit-btn').attr('now-text', NowSubmitBtnText).text('Отправить форму')
            $(this).siblings('.link_wrapper').fadeIn()
        }
        else if ($(this).find('.step_wrapper.open').index() == 1) {
            var InvalidCount = 0
            if ($(this).find('.label-default.invalid[for="input-status"]').length > 0) {
                InvalidCount = InvalidCount + 1
            }
            var AllInputsRequired = $(this).find('.step_wrapper.open .default-input_wrapper.required')
            AllInputsRequired.each(function (index, elem) {
                if ($(elem).children('.input-default').val() == '') {
                    var Invalid = "<span class='invalid-text'>Введите Ваши данные</span>"
                    if ($(elem).children('.invalid-text').length == 0) {
                        $(Invalid).appendTo($(elem))
                        $(elem).children('.input-default').addClass('invalid')
                    }
                    InvalidCount = InvalidCount + 1
                }
                if ($(elem).children('.input-default').val() && $(elem).children('.input-default').hasClass('input-phone')) {
                    if (!$(elem).children('.input-default.input-phone').inputmask('isComplete')) {
                        var Invalid = "<span class='invalid-text'>Ваши данные введены не верно</span>"
                        if ($(elem).children('.invalid-text').length == 0) {
                            $(Invalid).appendTo($(elem))
                            $(elem).children('.input-default').addClass('invalid')
                        }
                        InvalidCount = InvalidCount + 1
                    }
                }
            })
            if ($(this).find('.input-email').val() && !$(this).find('.input-email').inputmask('isComplete')) {
                var EmailInput = $(this).find('.input-email')
                var Invalid = "<span class='invalid-text'>Ваши данные введены не верно</span>"
                if (EmailInput.next('.invalid-text').length == 0) {
                    $(Invalid).appendTo(EmailInput.parent('.default-input_wrapper'))
                    $(EmailInput).addClass('invalid')
                }
                InvalidCount = InvalidCount + 1
            }
            if (InvalidCount == 0) {


                //++ Получение кода sms отправленного пользователю
                /*   var phoneNumber = $(this).find('.input-phone').val().replace(/[^\d]/g, '');
  
                  $.ajax({
                      type: 'POST',
                      url: 'http://api.asnova-telecom.ru/getcode.php',
                      data: {
                          phone: phoneNumber,
  
                      },
                      dataType: 'json',
                      error: function (e) { */
                //called when there is an error
                //console.log(e.message);
                /*                     }
                
                
                                }).done(function (data) {
                                    TestCode = data.code;
                                    console.log('Код авторизации пользователя (последние 4 цифры номера телефона):' + TestCode);
                
                                }).always(function () { */

                // Всегда исполняется после загрузки контента ajax
                // Например, для инициализации JS плагинов для полученного контента

                /*   }); */
                //-- Получение кода sms отправленного пользователю 


                $('#modal-form-steps').modal({
                    fadeDuration: 150,
                    closeClass: 'close-custom',
                    closeText: '<span class="visually-hidden">Закрыть</span>'
                })
                blockScroll('open')
                FormStepsSubmitBtn = $(this).siblings('.submit-btn_wrapper').children('.submit-btn')
            }
        }
        e.preventDefault()
    })
    //----------------------//

    // Delete blocked scroll on close modal window //
    $('.modal').on('modal:close', function (event, modal) {
        blockScroll('close')
    })
    //----------------------//

    // Delete class invalid on click inputs //
    $('body').on('focus click', '.input-default.invalid', function (e) {
        $(this).removeClass('invalid')
        $(this).next('.invalid-text').remove()
    })
    //----------------------//

    // hendler click on button "Назад" in form steps //
    $('body').on('click', '.form-steps_wrapper .link_wrapper', function (e) {
        $(this).siblings('.form-steps_block').find('.step_wrapper.open').removeClass('open').hide().prev().fadeIn().addClass('open')
        $(this).siblings('.steps_wrapper').find('.step_current').hide().text('1').fadeIn()
        $(this).siblings('.submit-btn_wrapper').find('.submit-btn').text(NowSubmitBtnText)
        $(this).hide()
    })
    //----------------------//

    // Valid Function after input 4 number phone //
    var validModalStepsForm = function ($this, InputNumber) {
        InputNumber.inputmask('remove')
        InputNumber.parent('.default-input_wrapper.required').removeClass('required')
        InputNumber.addClass('valid').attr('type', 'text').val('Всё прошло успешно!').attr('disabled', true)
        $this.next('.submit-btn').attr('disabled', true).css({
            'background-color': 'rgb(76, 175, 104)'
        }).text('Форма отправлена!').removeClass('pointer')
        FormStepsSubmitBtn.attr('disabled', true).css({
            'background-color': 'rgb(76, 175, 104)'
        }).text('Форма отправлена!').removeClass('pointer')
        FormStepsSubmitBtn.parent('.submit-btn_wrapper').siblings('.link_wrapper').remove()
    }
    var invalidModalStepsForm = function ($this, InputNumber) {
        InvalidText = "<span class='invalid-text'>Извините произошла ошибка, попробуйте снова</span>"
        if ($this.find('.invalid-text').length == 0) {
            $(InvalidText).appendTo($this.find('.default-input_wrapper'))
            InputNumber.addClass('invalid')
        }
    }
    //----------------------//

    // Test Code //
    var TestCode = '1234'
    console.log('Код авторизации пользователя (последние 4 цифры номера телефона):' + TestCode);

    // Validation form four-number //
    $('body').on('submit', '.modal-steps-form', function (e) {
        var InvalidText
        var InputNumber = $(this).find('.input-default')
        if (InputNumber.val() == "") {
            InvalidText = "<span class='invalid-text'>Введите Ваши данные</span>"
            if ($(this).find('.invalid-text').length == 0) {
                $(InvalidText).appendTo($(this).find('.default-input_wrapper'))
                InputNumber.addClass('invalid')
            }
        }
        else if (InputNumber.val() && InputNumber.val() != TestCode) {
            InvalidText = "<span class='invalid-text'>Ваши данные введены неверно</span>"
            if ($(this).find('.invalid-text').length == 0) {
                $(InvalidText).appendTo($(this).find('.default-input_wrapper'))
                InputNumber.addClass('invalid')
            }
        }
        else if (InputNumber.val() && InputNumber.val() == TestCode) {
            /* var formData = new FormData() */
            var MainForm = $('#form-steps'),
                $this = $(this)
            /*  AllInputFilesStepForm = MainForm.find('.input-default[type="file"]')
         AllInputFilesStepForm.each(function (index, elem) {
             formData.append("image" + index, elem.files[0])
             if (index == AllInputFilesStepForm.length - 1) {
                 formData.append("surname", MainForm.find('#surname').val())
                 formData.append("name", MainForm.find('#name').val())
                 formData.append("patronymic", MainForm.find('#patronymic').val())
                 formData.append("phone", MainForm.find('#step-phone').val().replace(/[^+\d]/g, ''))
                 formData.append("email", MainForm.find('#email').val()) */
            // Отправка главной формы на почтовый адрес //
            /*   $.ajax({
                  url: 'http://api.asnova-telecom.ru/sendform.php',
                  type: 'POST',
                  contentType: false,
                  processData: false,
                  dataType: 'json',
                  data: formData,
                  error: function (e) { */
            //called when there is an error
            /* console.log(e.message); */
            /*        },
               }).done(function (data) {
                   if (data.mail_send == "ok") {
                       validModalStepsForm($this, InputNumber)
                   }
                   else {
                       invalidModalStepsForm($this, InputNumber)
                   }
               }).always(function () { */

            // Всегда исполняется после загрузки контента ajax
            // Например, для инициализации JS плагинов для полученного контента

            /*  }); */
            /*         }
                }) */
            //----------------------//
            validModalStepsForm($this, InputNumber)
        }
        e.preventDefault()
    })
    //----------------------//


    var validBottomForm = function ($this) {
        $this.find('.question-form_submit').text('Отправлено!').css({
            'background-color': 'rgb(76, 175, 104)'
        }).attr('disabled', true)
    }


    // Validation question form in footer //
    $('body').on('submit', '.question-form', function (e) {
        var InvalidCount = 0
        var AllInputsRequired = $(this).find('.default-input_wrapper.required')
        AllInputsRequired.each(function (index, elem) {
            if ($(elem).children('.input-default').val() == '') {
                InvalidText = "<span class='invalid-text'>Введите Ваши данные</span>"
                if ($(elem).children('.input-default').next('.invalid-text').length == 0) {
                    $(InvalidText).appendTo($(elem))
                    $(elem).children('.input-default').addClass('invalid')
                }
                InvalidCount = InvalidCount + 1
            }
            if ($(elem).children('.input-default').val() && $(elem).children('.input-default').hasClass('input-phone')
                && !$(elem).children('.input-default').inputmask('isComplete')) {
                InvalidText = "<span class='invalid-text'>Ваши данные введены неверно</span>"
                if ($(elem).children('.input-default').next('.invalid-text').length == 0) {
                    $(InvalidText).appendTo($(elem))
                    $(elem).children('.input-default').addClass('invalid')
                }
                InvalidCount = InvalidCount + 1
            }
        })
        if (InvalidCount == 0) {
            var $this = $(this)
            /*  $.ajax({
                 type: 'POST',
                 url: 'http://api.asnova-telecom.ru/sendformbottom.php',
                 data: {
                     name: $(this).find('.input-default[name="form-name"]').val(),
                     phone: $(this).find('.input-default[name="form-phone"]').val().replace(/[^+\d]/g, ''),
                     comment: $(this).find('.input-default[name="form-comment"]').val(),
                 },
                 dataType: 'text',
                 error: function (e) { */
            //called when there is an error
            //console.log(e.message);
            /*    }


           }).done(function (data) {
               validBottomForm($this)
           }).always(function () { */

            // Всегда исполняется после загрузки контента ajax
            // Например, для инициализации JS плагинов для полученного контента

            /*  }); */
            validBottomForm($this)
        }
        e.preventDefault()
    })
})