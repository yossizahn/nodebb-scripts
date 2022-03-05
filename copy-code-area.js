(function() {
    /* globals require, $ */
    'use strict';
    require(['clipboard'], clipboard => {
        new clipboard('.copy-code', { target: trigger => trigger.previousElementSibling })
            .on('success', e => {
            e.clearSelection();
            $(e.trigger).attr('data-original-title', 'הועתק!').tooltip('fixTitle').tooltip('show');
            setTimeout(() => $(e.trigger).attr('data-original-title', 'העתק').tooltip('fixTitle').tooltip('hide'), 1000);
        });
    });
    $(window).on('action:posts.loaded action:topic.loaded action:posts.edited', () => {
        $('[component="post/content"]>pre').wrap('<div class="pre-wrapper"><div>').after('<i class="copy-code fa fa-copy"></i>');
        $('.copy-code').attr('title', 'העתק').tooltip({ container: 'body' });
    });
})();
