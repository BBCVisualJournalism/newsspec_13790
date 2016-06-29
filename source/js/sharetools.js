define(['wrapper', 'jquery', 'ShareTools', 'ShareToolsTemplate', 'vocab'], function (wrapper, $, ShareTools, ShareToolsTemplate, vocab) {
    var ShareToolsWrapper = function (selector, title, message, icon) {
        this.selector     = selector;
        this.$element     = $(this.selector);
        this.shareTitle   = vocab.share_intro + ' ' + title;
        this.shareMessage = message;
        this.shareImage   = icon;
        this.shareUrl     = wrapper.url().hostUrl;

        this.init();
    };

    ShareToolsWrapper.prototype = {
        init: function () {
            this.shareObject = new ShareTools({
                holderEl: this.selector,
                label: vocab.share_button_title,
                shareUrl: this.shareUrl,
                messages: {
                    twitter: this.shareTitle + '\r\n' + this.shareMessage,
                    facebook: {
                        title:       this.shareTitle,
                        description: this.shareMessage,
                        image:       '../common/img/' + this.shareImage // optional
                    },
                    email: {
                        subject: this.shareTitle,
                        message: this.shareMessage
                    },
                    app: {
                        shareEndpoint: 'bbcnewsapp://visualjournalism/share',
                        popup: false,
                        properties: {
                            title: this.shareTitle,
                            text: this.shareMessage
                        }
                    }
                },
                template: ShareToolsTemplate
            });
        }
    };

    return ShareToolsWrapper;
});