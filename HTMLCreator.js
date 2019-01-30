const HtmlCreator = {
    createElement: (tagName, attributes = {}, text) => {
        const el = document.createElement(tagName);
        for ( item in attributes) {
            el.setAttribute(item, attributes[item])
        }
        Object.assign(el, attributes);
        if (text) { el.appendChild(document.createTextNode(text)); }
      
        return el;
      }

    
}