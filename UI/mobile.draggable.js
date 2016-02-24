/**
 * Created by root on 10/16/15.
 */
Vs.package('vs.behaviors.MobileNativeStyleDraggable', (function () {
var htmlElm = document.getElementsByTagName('html').item(0);
        return {
            properties: {
                draggableElmSelector: {
                    type: String,
                    value: null
                },
                draggableElmParentSelector: {
                    type: String,
                    value: null
                },
                draggableElmX: {
                    type: Number,
                    //readOnly: true,
                    value: 0,
                    notify: true
                },
                draggableElmY: {
                    type: Number,
                    //readOnly: true,
                    value: 0,
                    notify: true
                },
                draggableElm: {
                    type: Element,
                    value: null
                },
                draggableElmParent: {
                    type: Element,
                    value: null
                },
                dragX: {
                    type: Boolean,
                    value: true
                },
                dragY: {
                    type: Boolean,
                    value: false
                },
                throwingParams: {
                    type: Object,
                    value: {
                        vx: 0,
                        vy: 0,
                        vxScroll: 0,
                        vyScroll: 0,
                        oldX: 0,
                        oldY: 0,
                        oldWindowScrollX: 0,
                        oldWindowScrollY: 0,
                        wdx: window.pageXOffset,
                        wdy: window.pageYOffset
                    }
                },
                frictionMultiplier: {
                    type: Number,
                    value: 0.92
                },
                autoActivateChild: {
                    type: Boolean,
                    value: true
                },
                conditionalLinks: {
                    type: Boolean,
                    value: true
                }

            },

            _onDraggablesChildOver: function (e) {
                if (!htmlElm.classList.contains('mobile')) {
                    e.currentTarget.classList.add('js-active');
                }
            },

            _onDraggablesChildOut: function (e) {
                var classList = e.currentTarget.classList;
                if (!htmlElm.classList.contains('mobile')) {
                    classList.remove('js-active');
                }
                else {
                    classList.remove('active');
                }
                document.activeElement = null;
            },

            _onDraggablesChildTap: function (e) {
                var elm = e.currentTarget,
                    loc = window.location;
                e.preventDefault();
                if (!this.dragging && elm.dataUrl) {
                    //angelsListCarouselMetics(elm.dataFirstname + " " + elm.dataLastname);
                    loc.href = elm.dataUrl;
                }
            },

            _onDrag: function (e) {
                console.log("A");
                var self = this,
                    draggableElm = self.draggableElm,
                    draggableElmParent = self.draggableElmParent,
                    tp = self.throwingParams,
                    x = self.draggableElmX,
                    y = self.draggableElmY,
                    wX = window.pageXOffset,
                    wY = window.pageYOffset;
                    console.log(e.detail.state);
                this._setAnimationSpeed(0);

                switch (e.detail.state) {
                    case 'start':
                        self._stopDraggableElmThrow(self);
                        self.dragging = true;
                        self.draggableElmX = -1 * self.getPanelPosition();
                        break;
                    case 'track':
                        // Drag element
                        self._draggableElmDrag(e, self, draggableElmParent, draggableElm);

                        // Track velocity and old x for throwing animation
                        tp.vx = (x - tp.oldX);
                        tp.vy = (y - tp.oldY);
                        tp.oldX = x;
                        tp.oldY = y;
                        tp.vxScroll = (wX - tp.oldWindowScrollX);
                        tp.vyScroll = (wY - tp.oldWindowScrollY);
                        tp.oldWindowScrollX = wX;
                        tp.oldWindowScrollY = wY;
                        break;
                    case 'end':
                        self.async(function(){
                            self.dragging = false;
                        },50);
                        // If there is throwing velocity, start throwing animation
                        if (Math.abs(tp.vx) > 0) {
                            self.throwing = true;
                            self._draggableElmThrow(self, draggableElmParent, draggableElm);
                        }

                        // Remove 'active' class from '.carousel-items'
                        self.clearActiveStateOnChildren();
                        break;
                }
            },

            _draggableElmDrag: function (e, self, outerContainer, innerContainer) {
                var newX, newY,
                    hoveringOnElm = e.detail.hover();
                
                if (this.dragX) {
                    newX = this.draggableElmX = e.detail.ddx + this.draggableElmX,
                    self.transform('translateX(' + newX + 'px)', innerContainer);
                }

                self.setPageByPanelPosition();
                self._toggleButtonDisplay();

                //if (Math.abs(e.detail.ddy) > 5) {
                    //window.scrollBy(0, -e.detail.ddy);
                //}

                self._constrainDraggableElm(self, innerContainer);

                // Whether to set 'active' class on immediate children of the draggable element
                if (!self.autoActivateChild) {
                    return;
                }

                // Remove 'active' class from '.carousel-items'
                //self.clearActiveStateOnChildren();

                // Find carousel-item from hovered element (@todo do not hard code carousel item class here)
                hoveringOnElm = self.findClosestWithClassName(hoveringOnElm, 'carousel-item');

                // If 'hovered element' then add 'active' class to it
                if (hoveringOnElm && hoveringOnElm.classList) {
                    // Add 'active' class to hovered '.carousel-item'
                    hoveringOnElm.classList.add('active');
                }
            },

            _draggableElmThrow: function (self, outerContainer, innerContainer) {
                // Request animation frame
                this._requestAnimationId = requestAnimationFrame(
                    self._draggableElmThrow.bind(self, self, outerContainer, innerContainer)
                );

                // If not throwing stop throwing animation
                if (self.throwing === false) {
                    cancelAnimationFrame(this._requestAnimationId);
                }

                // Get some params for throwing calc
                var tp = self.throwingParams,
                    x, y;

                // Set velocity
                tp.vx *= self.frictionMultiplier;
                tp.vy *= self.frictionMultiplier;
                tp.vxScroll *= self.frictionMultiplier;
                tp.vyScroll *= self.frictionMultiplier;

                // Set element position(s)
                self.draggableElmX += tp.vx;
                self.draggableElmY += tp.vy;
                tp.wdx += tp.vxScroll;
                tp.wdy += tp.vyScroll;

                // Variableize params
                x = self.draggableElmX;
                y = self.draggableElmY;

                if (this.dragX && this.draggableElmX < this.rightLimit) {
                    x = this.draggableElmX = this.rightLimit;
                    self.throwing = false;
                }
                else if (this.dragX && this.draggableElmX > this.leftLimit) {
                    self.throwing = false;
                    x = this.draggableElmX = this.leftLimit;
                }
                if (this.dragY && this.draggableElmY < this.bottomLimit) {
                    self.throwing = false;
                    y = this.draggableElmY = this.bottomLimit;
                }
                else if (this.dragY && this.draggableElmY > this.topLimit) {
                    self.throwing = false;
                    y = this.draggableElmY = this.topLimit;
                }

                //window.scrollBy(0, -tp.vy);

                // Transform element position
                self.transform('translate(' + x + 'px, 0px)', innerContainer);

               // if (self.throwing === true && Math.abs(tp.vx) > 50) {
                    self.setPageByPanelPosition();
                    self._toggleButtonDisplay();
                //}

                // If velocity is almost at zero stop the throwing animation
                if (self.throwing === true && Math.abs(tp.vx) < 0.01) {
                    self.dragging = false;
                    cancelAnimationFrame(this._requestAnimationId);
                }
            },

            _stopDraggableElmThrow: function (self) {
                self.throwing = false;
                cancelAnimationFrame(self._requestAnimationId);
            },

            _constrainDraggableElm: function (self, innerContainer) {
                var x, y, shouldTransform = false,
                    stopThrow = self._stopDraggableElmThrow;
                if (this.dragX && this.draggableElmX < this.rightLimit) {
                    x = this.draggableElmX = this.rightLimit;
                    self.throwing = false;
                    shouldTransform = true;
                }
                else if (this.dragX && this.draggableElmX > this.leftLimit) {
                    self.throwing = false;
                    x = this.draggableElmX = this.leftLimit;
                    shouldTransform = true;
                }
                if (this.dragY && this.draggableElmY < this.bottomLimit) {
                    self.throwing = false;
                    y = this.draggableElmY = this.bottomLimit;
                    shouldTransform = true;
                }
                else if (this.dragY && this.draggableElmY > this.topLimit) {
                    self.throwing = false;
                    y = this.draggableElmY = this.topLimit;
                    shouldTransform = true;
                }
                if (this.dragX && this.dragY && shouldTransform) {
                    stopThrow(self);
                    //self.transform('translate(' + x + 'px, ' + y + 'px)', innerContainer);
                }
                else if (shouldTransform && this.dragX) {
                    stopThrow(self);
                    self.transform('translateX(' + x + 'px)', innerContainer);
                }
                else if (shouldTransform && this.dragY) {
                    stopThrow(self);
                    //self.transform('translateY(' + y + 'px)', innerContainer);
                }
            },

            _populateDraggableDefaults: function () {
                var self = this;
                cancelAnimationFrame(this._requestAnimationFrameId);
                this._requestAnimationFrameId = null;
                this.draggableElm = this.$$(this.draggableElmSelector);
                this.draggableElmParent = this.$$(this.draggableElmParentSelector);
                this.draggableElmBox = this.draggableElm.getBoundingClientRect(),
                this.draggableElmParentBox = this.draggableElmParent.getBoundingClientRect(),
                this.draggableElmX = this.draggableElmBox.left + this.draggableElmParentBox.left;
                this.draggableElmY = this.draggableElmBox.top + this.draggableElmParentBox.top;
                this.leftLimit = 0;// this.draggableElmParentBox.left;
                this.rightLimit = -this.draggableElm.offsetWidth + this.draggableElmParent.offsetWidth;
                this.topLimit = 0;
                this.bottomLimit = -this.draggableElm.offsetHeight + this.draggableElmParent.offsetHeight;
                this.frictionMultiplier = 0.94;
                this.throwingParams.vx = this.draggableElmX;
                this.throwingParams.vy = this.draggableElmY;
                this.throwingParams.oldX = 0;
                this.throwingParams.oldY = 0;
            },

            findClosestWithClassName: function (elm, className) {
                var hasClassName = false;
                while (!hasClassName && elm) {
                    if (elm.className && elm.className.indexOf(className) > -1) {
                        hasClassName = true;
                    }
                    else {
                        elm = elm.parentNode;
                    }
                }
                return elm;
            },

            clearActiveStateOnChildren: function () {
                var self = this;

                sjl.argsToArray(this.itemsContainerElm.children).forEach(function (item) {
                    if (item.classList) {
                        item.classList.remove('active');
                        item.classList.remove('js-active');
                    }
                });
            }

        };
    }())
);