const app = {
    chatStatus: {
        0: 'online',
        1: 'offline',
        2: 'away',
        3: 'busy',
        4: 'hidden'
    },
    messageType: {
        1: 'text',
        2: 'image',
        3: 'vedio',
        4: 'audio'
    },
    participants: {
        0: 'single',
        1: 'group'
    },
    cfg_chat: {
        class_undefined: 'undefined',
        img_single_user: '/images/users.png',
        img_group_user: '/images/group.png',
        status_single: 'single',
        status_group: 'group',
        status_hidden_name: 'hidden',
        status_hidden_name_replace: 'offline',
        mood_message_request: 'User not share information',
        mood_message_responsive: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    }
};

module.exports = app;