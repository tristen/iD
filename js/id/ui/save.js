iD.ui.Save = function(context) {
    var history = context.history(),
        key = iD.ui.cmd('⌘S');

    function save() {
        d3.event.preventDefault();
        if (!history.hasChanges()) return;
        context.enter(iD.modes.Save(context));
    }

    return function(selection) {
        var button = selection.append('button')
            .attr('class', 'save col12 disabled')
            .attr('tabindex', -1)
            .on('click', save)
            .attr('data-original-title',
                iD.ui.tooltipHtml(t('save.no_changes'), key))
            .call(bootstrap.tooltip()
                .placement('bottom')
                .html(true));

        button.append('span')
            .attr('class', 'label')
            .text(t('save.title'));

        button.append('span')
            .attr('class', 'count')
            .text('0');

        var keybinding = d3.keybinding('undo-redo')
            .on(key, save);

        d3.select(document)
            .call(keybinding);

        var numChanges = 0;

        context.history().on('change.save', function() {
            var _ = history.numChanges();
            if (_ === numChanges)
                return;
            numChanges = _;

            button
                .attr('data-original-title',
                    iD.ui.tooltipHtml(t(numChanges > 0 ?
                        'save.help' : 'save.no_changes'), key));

            button
                .classed('disabled', numChanges === 0)
                .classed('has-count', numChanges > 0);

            button.select('span.count')
                .text(numChanges);
        });
    };
};
