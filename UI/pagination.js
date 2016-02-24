/**
 * Created by elycruz on 10/15/15.
 */

Vs.package('vs.behaviors.Paginator', {

    properties: {
        currPagePointer: {
            type: Number,
            value: 0,
            notify: true,
            observer: '_currPagePointerChange'
        },
        prevPagePointer: {
            type: Number,
            value: 0
        },
        nextPagePointer: {
            type: Number,
            value: 0
        },
        currPagePointerDir: {
            type: Number,
            value: 0,
            notify: true
        },
        wrapPagePointerPointers: {
            type: Boolean,
            value: true
        },
        itemsLength: {
            type: Number,
            value: 0,
            observer: '_itemsLengthChange'
        },
        itemsPerPage: {
            type: Number,
            value: 1,
            observer: '_itemsPerPageChange'
        },
        pagesLength: {
            type: Number,
            value: 0,
            //notify: true
        }
    },

    _nextPage: function () {
        var tmp = Math.ceil(this.currPagePointer);
        this.currPagePointer = (tmp === this.currPagePointer) ? this.currPagePointer + 1 : tmp;
        this._triggerPagePointerChange();
    },

    _prevPage: function () {
        var tmp = Math.floor(this.currPagePointer);
        this.currPagePointer = (tmp === this.currPagePointer) ? this.currPagePointer - 1 : tmp;
        this._triggerPagePointerChange();
    },

    _gotoPageNum: function (pointer) {
        this.currPagePointer = pointer;
        this._triggerPagePointerChange();
    },

    _itemsPerPageChange: function (newValue) {
        this.pagesLength = Math.ceil(this.itemsLength / newValue);
    },

    _itemsLengthChange: function (newValue) {
        this.pagesLength = Math.ceil(newValue / this.itemsPerPage);
    },

    _currPagePointerChange: function (newValue) {
        this.currPagePointer = this._normalizePagePointer(newValue);
        this.prevPagePointer = this._normalizePagePointer(newValue - 1);
        this.nextPagePointer = this._normalizePagePointer(newValue + 1);
    },

    _triggerPagePointerChange: function () {
        // trigger page pointer change event here
        this.fire('pagepointerchange', {
            currPagePointer: this.currPagePointer
        });
    },

    _normalizePagePointer: function (pointer) {
        var wrap = this.wrapPagePointerPointers,
            pagesLen = this.pagesLength;
        if (wrap && pointer > pagesLen) {
            pointer = 0;
        }
        else if (!wrap && pointer > pagesLen) {
            pointer = pagesLen;
        }

        if (wrap && pointer < 0) {
            pointer = pagesLen;
        }
        else if (!wrap && pointer < pagesLen) {
            pointer = 0;
        }
        return pointer;
    }

});
