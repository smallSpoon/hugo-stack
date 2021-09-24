/*!
*   Hugo Theme Stack
*
*   @author: Jimmy Cai
*   @website: https://jimmycai.com
*   @link: https://github.com/CaiJimmy/hugo-theme-stack
*/
import StackGallery from "ts/gallery";

import menu from 'ts/menu';
import createElement from 'ts/createElement';
import StackColorScheme from 'ts/colorScheme';

let Stack = {
    init: () => {
        /**
         * Bind menu event
         */
        menu();

        const articleContent = document.querySelector('.article-content') as HTMLElement;
        if (articleContent) {
            new StackGallery(articleContent);
        }

        /**
         * Add linear gradient background to tile style article


         * Add copy button to code block
        */
        const codeBlocks = document.querySelectorAll('.article-content .highlight');
        const copyText = `Copy`,
            copiedText = `Copied!`;
        codeBlocks.forEach(codeBlock => {
            const copyButton = document.createElement('button');
            copyButton.innerHTML = copyText;
            copyButton.classList.add('copyCodeButton');
            codeBlock.appendChild(copyButton);

            const pre = codeBlock.getElementsByTagName('pre');
            const code = pre[0].textContent;

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(code)
                    .then(() => {
                        copyButton.textContent = copiedText;

                        setTimeout(() => {
                            copyButton.textContent = copyText;
                        }, 1000);
                    })
                    .catch(err => {
                        alert(err)
                        console.log('Something went wrong', err);
                    });
            });
        });

        new StackColorScheme(document.getElementById('dark-mode-toggle'));
    }
}

window.addEventListener('load', () => {
    setTimeout(function () {
        Stack.init();
    }, 0);
})

declare global {
    interface Window {
        createElement: any;
        Stack: any
    }
}

window.Stack = Stack;
window.createElement = createElement;