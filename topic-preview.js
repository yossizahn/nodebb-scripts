(async function() {
    /* globals require, $, socket, app */
    'use strict';
    function requirePromise (arg) {
        return new Promise(resolve => require(arg, resolve))
    }
    const translate = (await requirePromise(['translator'])).translate
    function getTidFirstPost(tid) {
        return socket.emit('topics.loadMore', {
            tid,
            after: 0,
            count: 1,
            direction: 1
        })
    }
    async function onhover() {
        var self = $(this);
        if (!self.data('preview-loaded')) {
            let content
            try {
                const data = await getTidFirstPost(self.data('my-tid'))
                content = await translate(data.mainPost?.content || data.posts.find(p => p.pid === data.mainPid)?.content)
            } catch (err) {
                console.error(err)
                content = await translate(`<span style="color:red;">שגיאה: </span>${err.message}`)
            } finally {
                self.data('preview-loaded', 1);
            }
            $('#preview-' + self.data('my-tid')).children().html(content);
        }
        $('#preview-' + self.data('my-tid')).stop(true).delay(500).fadeIn();
    }

    function onunhover() {
        $('#preview-' + $(this).data('my-tid')).stop(true).fadeOut();
    }

    $(window).on('action:topics.loaded', (event, data) => {
        for (let topic of data.topics) {
            let topicElem = $('[data-tid="' + topic.tid + '"]');
            createPreview(topicElem);
        }
    });

    function addTopicTools() {
        let topicelems = $('[component="category/topic"]');
        topicelems.each((i, elem) => {
            createPreview($(elem));
        });
    }

    function createPreview(topicElem) {
        let tid = parseInt(topicElem.attr('data-tid'));
        if (!$('#preview-' + tid).length) {
            topicElem.find('.content').append('<div class="post-preview" id="preview-' + tid + '"><div class="wrap-post-preview">טוען...</div></div>');
            topicElem.find('.post-preview').hover(function () { $(this).stop(true).fadeIn(); }, function () { $(this).delay(600).fadeOut(); });
            topicElem.find('[component="topic/header"] a').data('my-tid', tid).hover(
                onhover,
                onunhover
            );
        }
    }

    $(window).on('action:ajaxify.end', addTopicTools);

})();
