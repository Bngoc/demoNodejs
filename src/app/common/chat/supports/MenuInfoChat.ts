'use strict';
declare let $: any;

export class MenuInfoChat {

    private contextMenuClassName: any = "context-menu";
    // var contextMenuItemClassName : any = "context-menu__item";
    private contextMenuLinkClassName: any = "context-menu__link";
    private contextMenuActive: any = "context-menu--active";

    private taskItemClassName: any = "task";
    private taskItemInContext;

    private clickCoords;
    private clickCoordsX;
    private clickCoordsY;

    private menu: any = document.querySelector("#" + this.contextMenuClassName);
    // var menuItems : any = menu.querySelectorAll("." + contextMenuLinkClassName);
    private menuState: any = 0;
    private menuWidth;
    private menuHeight;
    // var menuPosition;
    // var menuPositionX;
    // var menuPositionY;

    private windowWidth;
    private windowHeight;

    public clickInsideElement = function (e, className) {
        var el = e.srcElement || e.target;

        if (el.classList.contains(className)) {
            return el;
        } else {
            while (el = el.parentNode) {
                if (el.classList && el.classList.contains(className)) {
                    return el;
                }
            }
        }

        return false;
    };

    public getPosition = function (event) {
        let posx = 0;
        let posy = 0;
        let e = event ? event : window.event;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        return {x: posx, y: posy}
    };

    public contextListener = function () {
        let self = this;
        document.addEventListener("contextmenu", function (e) {
            self.taskItemInContext = self.clickInsideElement(e, self.taskItemClassName);

            if (self.taskItemInContext) {
                e.preventDefault();
                self.toggleMenuOn();
                self.positionMenu(e);
            } else {
                self.taskItemInContext = null;
                self.toggleMenuOff();
            }
        });
    };

    public clickListener = function (sendChatMessage, socket) {
        let self = this;
        document.addEventListener("click", function (e) {
            var clickElIsLink = self.clickInsideElement(e, self.contextMenuLinkClassName);

            if (clickElIsLink) {
                e.preventDefault();
                self.menuItemListener(sendChatMessage, socket, clickElIsLink);
            } else {
                var button = e.which || e.button;
                if (button === 1) {
                    self.toggleMenuOff();
                }
            }
        });
    };

    public keyupListener = function () {
        let self = this;
        window.onkeyup = function (e) {
            if (e.keyCode === 27) {
                self.toggleMenuOff();
            }
        }
    };

    public resizeListener = function () {
        let self = this;
        window.onresize = function (e) {
            self.toggleMenuOff();
        };
    };

    public toggleMenuOn = function () {
        if (this.menuState !== 1) {
            this.menuState = 1;
            this.menu.classList.add(this.contextMenuActive);
        }
    };

    public toggleMenuOff = function () {
        if (this.menuState !== 0) {
            this.menuState = 0;
            this.menu.classList.remove(this.contextMenuActive);
            this.menu.style = "";
        }
    };

    public positionMenu = function (e) {
        this.clickCoords = this.getPosition(e);
        this.clickCoordsX = this.clickCoords.x;
        this.clickCoordsY = this.clickCoords.y;

        this.menuWidth = this.menu.offsetWidth + 4;
        this.menuHeight = this.menu.offsetHeight + 4;

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;

        if ((this.windowWidth - this.clickCoordsX) < this.menuWidth) {
            this.menu.style.left = this.windowWidth - this.menuWidth + "px";
        } else {
            this.menu.style.left = (this.clickCoordsX - 100) + "px";
        }

        if ((this.windowHeight - this.clickCoordsY) < this.menuHeight) {
            this.menu.style.top = this.windowHeight - this.menuHeight + "px";
        } else {
            this.menu.style.top = (this.clickCoordsY - 50) + "px";
        }
        this.menu.style.display = 'block';
        this.menu.style['z-index'] = 99999;
    };

    public menuItemListener = function (sendChatMessage, socket, link) {
        let action = link.getAttribute("data-action");
        switch (action) {
            case 'view':
                sendChatMessage.clickTaskContactChat($('li[data-id="' + this.taskItemInContext.getAttribute("data-id") + '"]'), socket);
                break;
            default:
        }

        console.log("Task ID - " + this.taskItemInContext.getAttribute("data-id") + ", Task action - " + link.getAttribute("data-action"));
        this.toggleMenuOff();
    };
}