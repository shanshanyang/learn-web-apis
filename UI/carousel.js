/**
 * Created by elycruz on 10/15/15.
 */

Vs.package('vs.behaviors.Carousel', {

    properties: {
        itemsSelector: {
            type: String,
            value: '.carousel-item'
        },
        itemsContainerSelector: {
            type: String,
            value: '#carousel-items'
        },
        itemsElm: {
            type: Object,
            value: null
        },
        itemsContainerElm: {
            type: Object,
            value: null
        },
        orientations: {
            type: Object,
            value: {
                VERTICAL: 'vertical',
                HORIZONTAL: 'horizontal'
            },
            readOnly: true
        },
        orientation: {
            type: String,
            value: 'horizontal'
        },
        targetX: {
            type: Number,
            value: 0,
        },
        targetY: {
            type: Number,
            value: 0,
        },
        easeMultiplier: {
            type: Number,
            value: 0.5
        },
        _carouselRequestAnimationId: {
            type: Number,
            value: null
        }
    },

    attached: function () {
        var self = this;
        //self.async(function () {
            self.itemsContainerElm = self.$$(self.itemsContainerSelector);
            self.itemsContainerBox = self.itemsContainerElm.getBoundingClientRect();
            self.itemsElm = self.itemsElm || Polymer.dom(self.itemsContainerElm).querySelector(self.itemsSelector);
            self.itemsLength = self.carouselItemsData.length;
            self.carouselBox = self.$.carousel.getBoundingClientRect();
        //});
        if (document.getElementsByTagName('html').item(0).classList.contains('mobile')) {
            sjl.argsToArray(self.$.carousel.querySelectorAll('.controls')).forEach(function (item) {
                self.$.carousel.removeChild(item);
            });
        }
    },

    nextPage: function () {
        if (this.currPagePointer < this.pagesLength-1) {
            this._nextPage();
            cancelAnimationFrame(this._carouselRequestAnimationId);
            this.calculateCarouselTargets();
            this._animateToPageNum();
            this._toggleButtonDisplay();
        }
    },

    prevPage: function () {
        if (this.currPagePointer > 0) {
            this._prevPage();
            cancelAnimationFrame(this._carouselRequestAnimationId);
            this.calculateCarouselTargets();
            this._animateToPageNum();
            this._toggleButtonDisplay();
        }
    },

    gotoPageNum: function (num) {
        this._gotoPageNum(num);
        cancelAnimationFrame(this._carouselRequestAnimationId);
        this.calculateCarouselTargets();
        this._animateToPageNum();
    },

    getPanelPosition: function() {
        var styleStr = this.itemsContainerElm.getAttribute("style"),
            match,
            xPos;
        match = styleStr.match(/translate.?\(-?\d+\.?\d+(?=px)/);
        if(match) {
            xPos = match[0].replace(/translate.?\(-?/, '') * 1;
        } else {
            xPos = 0;
        }
        return xPos;
    },

    setPageByPanelPosition: function() {
        var xPos = this.getPanelPosition();
        this.currPagePointer = xPos / this.itemsElmWidth / this.itemsPerPage;
    },

    _animateToPageNum: function () {
        //this._carouselRequestAnimationId = requestAnimationFrame(this._animateToPageNum.bind(this));

        var box = this.itemsContainerElm.getBoundingClientRect(),
            box2 = this.$.carousel.getBoundingClientRect(),
            translateSuffix = '',
            values, dx, dy,
            left = box.left - box2.left,
            min = -box.width + box2.width;

        // Figure out values for 'translate' here
        if (this.orientation === this.orientations.VERTICAL) {
            translateSuffix = 'Y';
            dy = (this.targetY - box.top) * this.easeMultiplier;
            values = dy + 'px';
        }
        else if (this.orientation === this.orientations.HORIZONTAL) {
            translateSuffix = 'X';
            dx = (this.targetX - left) * this.easeMultiplier;
            if(-this.targetX <= min) this.targetX = -min;
            //values = -dx + 'px';
            values = -this.targetX + 'px';
        }
        else {
            dx = (this.targetX - (box.left * 2 + box2.left)) * this.easeMultiplier;
            dy = (this.targetY - (box.top * 2 + box2.right)) * this.easeMultiplier;
            values = dx + 'px, ' + dy + 'px';
        }

        // Transform items container
        this._setAnimationSpeed(Math.abs((Math.abs(this.targetX) - Math.abs(this.getPanelPosition())) * .5));
        this.transform('translate' + translateSuffix + '(' + values + ')', this.itemsContainerElm);

        // If animation is done clear request animation frame
        if (Math.abs(left).toFixed(3) === Math.abs(this.targetX).toFixed(3)) {
            cancelAnimationFrame(this._carouselRequestAnimationId);
        }
    },

    _setAnimationSpeed: function(s) {
        this.itemsContainerElm.style.transitionDuration = s + "ms";
        this.itemsContainerElm.style.WebkitTransitionDuration = s + "ms";
    },

    _toggleButtonDisplay: function () {
        var lineup = document.getElementById('carousel'),
            prevBtn = lineup.getElementsByClassName('prev-btn')[0],
            nextBtn = lineup.getElementsByClassName('next-btn')[0],
            current = this.currPagePointer;
        if (current === 0) {
            prevBtn.style.display = "none";
        } else if (current >= this.pagesLength-1) {
            nextBtn.style.display = "none";
        } else {
            prevBtn.style.display = "block";
            nextBtn.style.display = "block";
        }
    },

    calculateCarouselTargets: function () {
        if (this.orientation === this.orientations.VERTICAL) {
            this.targetY = this.itemsElmHeight *
                this.itemsPerPage * this.currPagePointer - this.itemsContainerElm.offsetTop;
        }
        else {
            //this.targetX = (this.itemsElmWidth * this.itemsPerPage * this.currPagePointer) + this.itemsContainerBox.left + this.$.carousel.getBoundingClientRect().left;
            this.targetX = this.itemsElmWidth * this.itemsPerPage * this.currPagePointer;
        }
    },

    calculateItemsPerPage: function () {
        this.itemsPerPage = 5;
    }


});