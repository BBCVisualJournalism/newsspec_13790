define(['wrapper', 'jquery', 'ShareTools', 'ShareToolsTemplate', 'vocab'], function (wrapper, $, ShareTools, ShareToolsTemplate, vocab) {
    var ShareToolsWrapper = function (selector, categoryNumber, icon) {
        this.selector     = selector;
        this.$element     = $(this.selector);
        this.shareTitle   = vocab['share_result_' + categoryNumber];
        this.shareImage   = icon;
        this.shareUrl     = wrapper.url().hostUrl;

        this.init();
    };

    ShareToolsWrapper.prototype = {
        init: function () {
            var self = this;
            var config = {
                holderEl: this.selector,
                label: vocab.share_button_title,
                shareUrl: self.setShareUrl(),
                messages: {
                    twitter: this.shareTitle + ' ' + vocab.share_outro_text,
                    facebook: {
                        title:       this.shareTitle,
                        description: vocab.share_outro_text,
                        image:       'http://www.stage.bbc.co.uk/news/special/2016/newsspec_13790/content/iframe/common/img/' + this.shareImage
                    },
                    email: {
                        subject: this.shareTitle,
                        message: this.shareTitle + ' ' + vocab.share_outro_text
                    },
                    app: {
                        shareEndpoint: 'bbcnewsapp://visualjournalism/share',
                        popup: false,
                        properties: {
                            title: this.shareTitle,
                            text: this.shareTitle + ' ' + vocab.share_outro_text
                        }
                    }
                },
                template: ShareToolsTemplate
            };

            if (wrapper.wrapper === 'app') {
                // we often want to deliver a different share view to the app
                config.template = '\
                    <div class="share ns__share-dropdown ns__share--app">\
                        <a class="share__button share__tool--network" data-network="app" href="#" style="height: 30px; background-size: 25%; width: 90px; font-weight: normal;">' + vocab.share_button_title + '</a>\
                    </div>';
            }

            this.shareObject = new ShareTools(config);

            this.shareObject.onShareButtonClick(function (network) {
                var istatsInfo = {
                    actionName: 'newsspec-interaction',
                    actionType: network + '_share-clicked',
                    viewLabel: true
                };
                console.log(istatsInfo);
                wrapper.callIstats(istatsInfo);
            });
        },
        string_endsWith: function (str, end) {
            var temp = str.slice(str.length - end.length);
            return (end === temp);
        },
        setShareUrl: function () {
            var shareLinkEndsWithDotApp = this.string_endsWith(this.shareUrl, '.app');
            if (shareLinkEndsWithDotApp){
                this.shareUrl = this.shareUrl.substring( 0, this.shareUrl.indexOf( '.app' ) );
            }
            return this.shareUrl;
        }
    };

    return ShareToolsWrapper;
});