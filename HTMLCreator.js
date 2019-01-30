var HTMLCreator = {
    createElement: function(element, parent){
        var body;
        if(parent == null)
            body = document.getElementsByTagName('body')[0]
        else
            body = parent
        if(! element.id)
            element.id  = ""
        newElement = document.createElement(element.type);
        newElement.id = element.id;
        newElement.class = element.class;  
        var t = document.createTextNode(element.text);
        newElement.appendChild(t);                     
        body.appendChild(newElement);                 
    }
}