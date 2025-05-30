import { DOCUMENT } from '@angular/common';
import {
    Directive,
    Output,
    EventEmitter,
    HostListener,
    Input,
    Renderer2,
    Inject,
} from '@angular/core';

@Directive({
    selector: '[mnmContextMenu]',
})
export class ContextMenuDirective {
    @Output() public menuItemSelected = new EventEmitter<string>();

    @Input('mnmContextMenu') public items: [
        {
            id: string;
            name: string;
        }
    ];

    @Input() public onRightClick: boolean = false;

    private shownMenu: HTMLElement = null;
    private document: Document;

    private hideShownMenu = () => {
        if (this.shownMenu) {
            this.renderer.removeChild(this.document.body, this.shownMenu);
            this.shownMenu = null;

            window.removeEventListener('click', this.hideShownMenu);
            window.removeEventListener('scroll', this.hideShownMenu);
        }
    };

    constructor(
        private renderer: Renderer2,
        @Inject(DOCUMENT) document: any
    ) {
        this.document = document;
    }

    @HostListener('contextmenu', ['$event'])
    public showContextMenuRightClick(event: MouseEvent) {
        if (!this.onRightClick) {
            return;
        }

        const x = event.pageX;
        const y = event.pageY;

        event.preventDefault();
        this.buildContextMenu(x, y);
    }

    @HostListener('click', ['$event'])
    public showContextMenu(event: TouchEvent | MouseEvent) {
        let x = undefined,
            y = undefined;

        if (
            (event as TouchEvent).touches &&
            (((event as TouchEvent).touches.length === 1 &&
                !this.onRightClick) ||
                ((event as TouchEvent).touches.length === 2 &&
                    this.onRightClick))
        ) {
            x = (event as TouchEvent).touches[0].screenX;
            y = (event as TouchEvent).touches[0].screenY;
        } else if (!this.onRightClick) {
            x = (event as MouseEvent).pageX;
            y = (event as MouseEvent).pageY;
        }

        if (x && y) {
            event.preventDefault();
            this.buildContextMenu(x, y);
        }
    }

    private buildContextMenu(x: number, y: number) {
        this.hideShownMenu();

        const pageWidth = this.document.body.offsetWidth;
        const pageHeight = this.document.body.offsetHeight;
        const threshold = 150;

        const menuItems = this.items.map(x => {
            const button = this.document.createElement('button');
            button.innerHTML = x.name;
            button.style.display = 'inline-block';
            button.style.width = '100%';
            this.renderer.listen(button, 'click', _ => {
                this.dispatchItemSelected(x.id);
            });
            return button;
        });

        this.shownMenu = this.document.createElement('div');
        this.shownMenu.style.display = 'flex';
        this.shownMenu.style.flexDirection = 'flex-column';
        this.shownMenu.style.position = 'absolute';

        if (x + threshold < pageWidth) {
            this.shownMenu.style.left = `${x}px`;
        } else {
            this.shownMenu.style.right = `${pageWidth - x}px`;
        }

        if (y + threshold < pageHeight) {
            this.shownMenu.style.top = `${y}px`;
        } else {
            this.shownMenu.style.bottom = `${pageHeight - y}px`;
        }

        this.shownMenu.append(...menuItems);

        this.renderer.addClass(this.shownMenu, 'mnm-context-menu');
        this.renderer.appendChild(this.document.body, this.shownMenu);

        setTimeout(() => {
            window.addEventListener('click', this.hideShownMenu);
            window.addEventListener('scroll', this.hideShownMenu);
        }, 25);
    }

    private dispatchItemSelected(id: string): void {
        this.hideShownMenu();
        this.menuItemSelected.emit(id);
    }
}
