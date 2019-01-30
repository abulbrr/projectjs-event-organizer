var CollectionUtils = {}
CollectionUtils.forEach = function(collection, callback) {
    if(collection.length == 0)
        return;
    if(!collection instanceof array)
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            callback(element,i)         
        }
}

CollectionUtils.filter   = function(collection, callback) {
    let temp = []
    for (let index = 0; index < collection.length; index++) {
        const element = collection[index];
        if(callback(element))
            temp.push(element)
    }

    return temp;
}

CollectionUtils.find    = function(collection, callback) {
    for (let index = 0; index < collection.length; index++) {
        const element = collection[index];
        if(callback(element))
            return element
    }
    return false
}

CollectionUtils.map  = function(collection, callback) {
    let temp = [];
    for (let index = 0; collection < array.length; index++) {
        const element = arrcollectionay[index];
        temp.push(callback(element))        
    }
    return temp
}


var LocalStorage = {
    login: function( uuid ) {
        localStorage.setItem('user', uuid);
    },
    getLoggedInUser: function() {
        let userId = localStorage.getItem('user');

        ClientsList = this.getClients();
        let user = CollectionUtils.find( ClientsList, (client) => {
            return (client.uuid == userId);
        })
        if( user != false )
            return user
        else
            alert('logged in user not found')
    },
    isUserLoggedIn: function() {
        let user =  localStorage.getItem('user');
        return (user != "" && user != null)
    },
    logout: function() {
        localStorage.setItem('user', '');
    },
    addEvent: function (item , success, err) {
        EventsList = LocalStorage.getEvents();
        EventsList.push(item)
        LocalStorage.saveEvents();
        success()
    },

    addClient: function (client, callback) {
        ClientsList = this.getClients()
        ClientsList.push(client);
        this.saveClients();
    },

    addClientToEvent: function( client, eventUuid )
    {
        var event = CollectionUtils.find( EventsList, (element) => { 
            return element.uuid == eventUuid 
        })

        if(event == false)
        {
            console.log('EVENT IS FALSE')
        }
        let isAlreatAttending = CollectionUtils.find( event.atendees, (atendee) => {
            return atendee == client.uuid
        } )

        if(isAlreatAttending != false)
        {
            console.log('already attending!')
            return;
        }

        event.atendees.push( client.uuid )
        this.updateEvent(event);

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

        if(EventsList == null)
        {
            console.log('there are no clients returning empty array ')
            return []
        }
        return EventsList;
    },
    getClients: function() {
        ClientsList = JSON.parse(localStorage.getItem('ClientList'));
        if(ClientsList == null)
        {
            console.log('there are no clients returning empty array')
            return []
        }
        console.log('ClientsList:' + ClientsList)
        return ClientsList
    },
    saveEvents: function() {
        localStorage.setItem('EventsList', JSON.stringify(EventsList));
        this.getEvents()
    },
    saveClients: function() {
        localStorage.setItem('ClientList', JSON.stringify(ClientsList));
        this.getClients()
    },
    updateEvent: function(item) {
        this.getEvents();
        let event = CollectionUtils.find( EventsList, (event) => {
            return event.uuid == item.uuid
        })
        EventsList.splice(event,1)
        EventsList.push(item)
        this.saveEvents();
    }
}

ClientsList = LocalStorage.getClients()
EventsList = LocalStorage.getEvents()
