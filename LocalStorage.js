var LocalStorage = {
    addEvent: function (item) {
        LocalStorage.getEvents();
        EventsList.push(item)
        LocalStorage.saveEvents();
    },
    removeEvent: function(uuid, callback) {
        this.getEvents();
        var item;
        for(var i = 0; i < EventsList.length;++i )
        {   
            if(EventsList[i].uuid == uuid)
            {
                item = EventsList[i]
                break;
            }
        }

        if(item != undefined)
        {
            callback()
            EventsList.splice(EventsList.indexOf(item), 1)
            this.saveEvents();
        }
    },
    getEvents: function() {
        EventsList = JSON.parse(localStorage.getItem('EventsList'));
        return EventsList;
    },
    saveEvents: function() {
        localStorage.setItem('EventsList', JSON.stringify(EventsList));
        this.getEvents()
    },
    updateEvent: function(item) {
        getEvents();
        EventsList.filter( i => i.uuid == item.uuid ) = item;
    }
}
