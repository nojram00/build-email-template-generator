class MyInput extends HTMLInputElement {
    constructor(){
        super();
    }

    get target(){
        var _target = this.getAttribute('target');

        if(_target == undefined) return null;

        return document.getElementById(this.getAttribute('target'));
    }

    connectedCallback(){
        requestAnimationFrame(() => {
            this.addEventListener('change', () => {
                console.log(this.value);
                this.target.innerText = this.value;
            })
        })
    }
}

var observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.target.href = mutation.target.innerText 
                })
            })

class Clickable extends HTMLAnchorElement {
    constructor(){
        super();
    }

    connectedCallback(){
        requestAnimationFrame(() => {
            observer.observe(this, {
                subtree: true,
                childList: true
            })
        })
    }
}

class CopyBtn extends HTMLButtonElement {
    constructor(){
        super();
    }

    get target(){
        var attr = this.getAttribute('target');

        if(attr == undefined) return null;

        return document.getElementById(attr);
    }

    connectedCallback(){
        this.onclick = () => {
            const tableClone = this.target.cloneNode(true);
            const table = tableClone.querySelector('table');
            const cells = tableClone.querySelectorAll('th, td');

            console.log(tableClone)
            
            table.style.cssText = 'border-collapse: collapse; width: 100%;';

            cells.forEach(cell => {
                cell.style.cssText = 'border: 1px solid #ddd; padding: 8px; text-align: left;';
                
                if(/td-header/g.test(cell.className)){
                    cell.style.cssText += `font-weight: 600;`
                }

                if (cell.tagName === 'TH') {
                    cell.style.backgroundColor = window.color ?? '#f2f2f2';
                }
            });
            
            navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([tableClone.outerHTML], { type: 'text/html' })
                })
            ]).then(() => alert('Copied'))
        }
    }
}

class ColorPicker extends HTMLInputElement {
    constructor(){
        super();
    }

    get target(){
        var attr = this.getAttribute('target');

        if(attr == undefined) return null;

        return document.getElementById(attr);
    }

    connectedCallback(){
        this.onchange = () => {
            window.color = this.value;
            if(this.target){
                this.target.style.cssText = `background-color: ${window.color};`
            }
        }
    }
}

class CSVFormConverter extends HTMLFormElement {
    constructor(){
        super()
    }

    get filename(){
        return this.getAttribute('filename') || 'data';
    }

    connectedCallback(){
        this.addEventListener('submit', (e) => {
            e.preventDefault()
            const formdata = new FormData(this)

            let values = []
            formdata.forEach((v, k) => {
                values.push(`${k},${v}`);
            })

            var csv = values.join('\n')
            console.log(csv);

            const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.filename}.csv`

            a.click()

            URL.revokeObjectURL(url);
        });
    }
}

customElements.define('x-input', MyInput, { extends: 'input' });
customElements.define('x-cpb', CopyBtn, { extends: 'button' });
customElements.define('x-csv', CSVFormConverter, { extends: 'form' });
customElements.define('x-anc', Clickable, { extends: 'a' });
customElements.define('x-color', ColorPicker, { extends: 'input' });