import { Directive, Output, EventEmitter, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[mnmContextMenu]'
})
export class ContextMenuDirective {
    @Output() menuItemSelected = new EventEmitter<string>();

    @Input('mnmContextMenu') public items: [{
        id: string;
        name: string;
    }]

    @Input() public onRightClick: boolean = false;

    private shownMenu: HTMLElement = null;

    private hideShownMenu = () => {
        if (this.shownMenu) {
            this.renderer.removeChild(document.documentElement, this.shownMenu);
            this.shownMenu = null;

            window.removeEventListener('click', this.hideShownMenu);
            window.removeEventListener('scroll', this.hideShownMenu);
        }
    }

    constructor(private renderer: Renderer2) { }

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
        let x = undefined, y = undefined;

        if ((event as TouchEvent).touches && (
            (event as TouchEvent).touches.length === 1 && !this.onRightClick ||
            (event as TouchEvent).touches.length === 2 && this.onRightClick
        )) {
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

        const menuItems = this.items.map(x => {
            const button = document.createElement('button');
            button.innerHTML = x.name;
            button.style.display = 'inline-block';
            button.style.width = '100%';
            this.renderer.listen(button, 'click', _ => {
                this.dispatchItemSelected(x.id);
            });
            return button;
        });


        this.shownMenu = document.createElement('div');
        this.shownMenu.style.position = 'absolute';
        this.shownMenu.style.left = `${x}px`;
        this.shownMenu.style.top = `${y}px`;
        this.shownMenu.append(...menuItems);

        this.renderer.appendChild(document.documentElement, this.shownMenu);

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