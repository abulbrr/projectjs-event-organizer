var CollectionUtils = {}
CollectionUtils.forEach = function (collection, callback) {
    if (collection.length == 0)
        return;
    for (let index = 0; index < collection.length; index++) {
        const element = collection[index];
        callback(element, index)
    }
}

CollectionUtils.max = function (collection) {
    if (collection.length == 0)
        return;
    let max = 0
    let times = 1
    let element
    for (let index = 0; index < collection.length; index++) {
        const elementLength = collection[index].atendees.length;
        if (elementLength == max) 
        {
            times++
        }
        else if (elementLength > max)
        {
            max = elementLength
            times = 1
            element = collection[index]
        }
    }
    if(times == collection.length)
    {
        alert("All events are equals")
        return false
    }

    return element
}

CollectionUtils.filter = function (collection, callback) {
    let temp = []
    for (let index = 0; index < collection.length; index++) {
        const element = collection[index];
        if (callback(element))
            temp.push(element)
    }

    return temp;
}

CollectionUtils.find = function (collection, callback) {
    for (let index = 0; index < collection.length; index++) {
        const element = collection[index];
        if (callback(element))
            return element
    }
    return false
}

CollectionUtils.map = function (collection, callback) {
    let temp = [];
    for (let index = 0; collection < array.length; index++) {
        const element = arrcollectionay[index];
        temp.push(callback(element))
    }
    return temp
}


var LocalStorage = {
    login: function (uuid) {
        localStorage.setItem('user', uuid);
    },
    getUserById: function (id) {
        ClientsList = this.getClients();
        let user = CollectionUtils.find(ClientsList, (client) => {
            return (client.uuid == id);
        })
        if (user != false)
            return user
        else
            console.log('user not found')
    },
    getEventById: function (id) {
        EventsList = this.getEvents();
        let event = CollectionUtils.find(EventsList, (event) => {
            return (event.uuid == id);
        })
        if (event != false)
            return event
        else
            console.log('event not found')
    },
    getLoggedInUser: function () {
        let userId = localStorage.getItem('user');
        let user = this.getUserById(userId)

        if (user != false)
            return user
        else
            alert('logged in user not found')
    },
    isUserLoggedIn: function () {
        let user = localStorage.getItem('user');
        return (user != "" && user != null)
    },
    logout: function () {
        localStorage.setItem('user', '');
        window.location.href = './login.html'
    },
    addEvent: function (item, success, err) {
        if (this.isSystemLocked()) {
            alert('THE SYSTEM IS LOCKED PLEASE UNLOCK AND TRY AGAIN')
            return
        }
        EventsList = LocalStorage.getEvents();
        EventsList.push(item)
        LocalStorage.saveEvents();
        success()
    },

    addClient: function (client, callback) {
        if (this.isSystemLocked()) {
            alert('THE SYSTEM IS LOCKED PLEASE UNLOCK AND TRY AGAIN')
            return
        }
        ClientsList = this.getClients()
        ClientsList.push(client);
        this.saveClients();
    },

    addClientToEvent: function (client, eventUuid) {
        if (this.isSystemLocked()) {
            alert('THE SYSTEM IS LOCKED PLEASE UNLOCK AND TRY AGAIN')
            return
        }
        var event = CollectionUtils.find(EventsList, (element) => {
            return element.uuid == eventUuid
        })
        
        if (event == false) {
            console.log('EVENT IS FALSE')
        }
        let isAlreatAttending = CollectionUtils.find(event.atendees, (atendee) => {
            return atendee == client.uuid
        })
        
        if (event.isNsfw && client.age < 18) {
            console.log('event is nsfw You cant attend it yet try again after ' + (18 - client.age) + ' years :)')
            return;
        }
        let isVip = client.events.length % 5 == 0 ? true : false 
        if( !isVip && client.wallet < event.price )
        {
            alert('You dont have enough money to attend the event')
            return
        }

        if (isAlreatAttending != false) {
            console.log('already attending!')
            return;
        }
        console.log('sucessfully added client to event')
        if(!isVip)
        {
            client.wallet -= event.price
        }
        else
        {
            alert('you are a vip client you will go to this event for free :D')
        }
        event.atendees.push(client.uuid)
        client.events.push(event.uuid)

        console.log(client)
        console.log(event.price)

        this.updateClients(client)
        this.updateEvent(event);

    },
    removeAtendeeFromEvent: function (eventId, userId) {
        if (this.isSystemLocked()) {
            alert('THE SYSTEM IS LOCKED PLEASE UNLOCK AND TRY AGAIN')
            return
        }
        this.getClients();
        this.getEvents();

        let event = this.getEventById(eventId);

        let user = this.getUserById(userId);
        user.events.splice(user.events.indexOf(eventId),1)
        event.atendees.splice(event.atendees.indexOf(userId), 1)
        this.saveClients();
        this.saveEvents();
    },
    removeEvent: function (uuid, callback) {
        if (this.isSystemLocked()) {
            alert('THE SYSTEM IS LOCKED PLEASE UNLOCK AND TRY AGAIN')
            return
        }

        this.getEvents();
        var item;
        for (var i = 0; i < EventsList.length; ++i) {
            if (EventsList[i].uuid == uuid) {
                item = EventsList[i]
                break;
            }
        }

        if (item != undefined) {
            callback()
            EventsList.splice(EventsList.indexOf(item), 1)
            this.saveEvents();
        }
    },
    getEvents: function () {
        EventsList = JSON.parse(localStorage.getItem('EventsList'));

        if (EventsList == null) {
            console.log('there are no clients returning empty array ')
            return []
        }
        return EventsList;
    },
    getClients: function () {
        ClientsList = JSON.parse(localStorage.getItem('ClientList'));
        if (ClientsList == null) {
            console.log('there are no clients returning empty array')
            return []
        }
        return ClientsList
    },
    saveEvents: function () {
        localStorage.setItem('EventsList', JSON.stringify(EventsList));
        this.getEvents()
    },
    saveClients: function () {
        localStorage.setItem('ClientList', JSON.stringify(ClientsList));
        this.getClients()
    },
    updateEvent: function (item) {
        this.getEvents();
        let event = CollectionUtils.find(EventsList, (event) => {
            return event.uuid == item.uuid
        })
        let index = EventsList.indexOf(event)
        EventsList.splice(index, 1)
        EventsList.push(item)
        this.saveEvents();
    },
    updateClients: function (item) {
        this.getClients();
        let client = CollectionUtils.find(ClientsList, (client) => {
            return client.uuid == item.uuid
        })
        let index = ClientsList.indexOf(client)
        ClientsList.splice(index, 1)
        ClientsList.push(item)
        this.saveClients();
    },
    lock: function () {
        localStorage.setItem('system', 'locked');
        let state = localStorage.getItem('system')
    },
    unlock: function () {
        localStorage.setItem('system', '')
        let state = localStorage.getItem('system')
    },
    isSystemLocked: function () {
        let state = localStorage.getItem('system')
        return (!state == '')
    }
}
ClientsList = LocalStorage.getClients()
EventsList = LocalStorage.getEvents()
