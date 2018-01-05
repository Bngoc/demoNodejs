let LibFunction = function () {
    this.swap = function (json) {
        var ret = {};
        for (var key in json) {
            ret[json[key]] = key;
        }
        return ret;
    };

    this.convertHtmlToPlainText = function (strHtml) {
        let stringHtml = strHtml !== undefined ? strHtml : "";
        if (stringHtml == '') return;

        return stringHtml.replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/\n/g, '<br>');
    };

    this.activeLastWeek = function (dateCheck, nowTimestampLastWeek) {
        let timestemp = new Date(dateCheck);
        return timestemp >= nowTimestampLastWeek;
    };

    this.convertDateTimeToInt = function (reqDatetime) {
        let datatime = reqDatetime !== undefined ? reqDatetime : null;
        if (datatime == null) return;
        let datetime = new Date(datatime);

        return datetime.getTime();
    };

    this.randomStringGenerate = function () {
        return Math.random().toString(36).substring(2);
    };

    this.ucfirst = function (str) {
        let string = (str !== undefined ? str : '');
        if (str === '') return '';

        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    this.getListContactSingle = function (modelConversation, option) {
        let dataResult = [];
        let _this = this;
        modelConversation.forEach(function (elemItem) {
            if (elemItem.type === option.single) {
                let useContact = elemItem.infoAccountParticipant.relations.useContacts;
                let cfg_chat = JSON.parse(useContact.attributes.cfg_chat);
                let tempDataResult = {};

                tempDataResult.first_name = useContact.attributes.first_name;
                tempDataResult.last_name = useContact.attributes.last_name;
                tempDataResult.middle_name = useContact.attributes.middle_name;
                tempDataResult.gender = useContact.attributes.gender;
                tempDataResult.user_id = useContact.attributes.users_id;
                tempDataResult.mood_message = useContact.attributes.mood_message;
                tempDataResult.path_img = useContact.attributes.path_img;
                tempDataResult.country = useContact.attributes.country;
                tempDataResult.email = elemItem.infoAccountParticipant.attributes.email;
                tempDataResult.phone = elemItem.infoAccountParticipant.attributes.phone;
                tempDataResult.user_name = useContact.attributes.user_name;
                tempDataResult.path_img_default = cfg_chat.img_single_user;
                tempDataResult.created_at = _this.convertDateTimeToInt(elemItem.infoAccountParticipant.attributes.created_at);

                dataResult.push(tempDataResult);
            }
        });

        return dataResult;
    };

    this.renderDataContentChat = function (useContactsSingle, listUserParticipant, option) {
        let booleanFindUserSingle = (option.indexFindUserSingle !== -1);
        let tempPartSingle = {
            email: option.eleSingle.get('email'),
            phone: option.eleSingle.get('phone'),
            user_name: useContactsSingle.get('user_name'),
            users_id: useContactsSingle.get('users_id'),
            first_name: useContactsSingle.get('first_name'),
            last_name: useContactsSingle.get('last_name'),
            middle_name: useContactsSingle.get('middle_name'),
            gender: useContactsSingle.get('gender'),
            is_life: useContactsSingle.get('is_life'),
            mood_message: useContactsSingle.get('mood_message'),
            status: useContactsSingle.get('status'),
            statusName: option.tempChatStatusName,
            strListStatus: option.strListStatus,
            isFriendCurrent: booleanFindUserSingle ? (listUserParticipant[option.indexFindUserSingle].is_accept_single != 1) : false,
            channelID: booleanFindUserSingle ? listUserParticipant[option.indexFindUserSingle].channelId : null,
            conversationID: booleanFindUserSingle ? listUserParticipant[option.indexFindUserSingle].conversationID : null,
            moodMessageShow: option.moodMessageTemp,
            classStatus: option.tempClassStatus,
            codePartId: booleanFindUserSingle ? listUserParticipant[option.indexFindUserSingle].codePartId : null,
        };

        return tempPartSingle;
    };

    this.getListContactSingleSearchAll = function (contactList, option) {
        if (option.valSearch === null) return contactList;

        let search = new RegExp(option.valSearch, "i");
        let listContactSingleSearch = [];

        contactList.forEach(function (items) {
            let temp = items;
            if (items.isSingle === true) {
                let middle_name = search.test(items.middle_name);
                let email = search.test(items.email);
                let user_name = search.test(items.user_name);


                let textSearch = items.middle_name;
                let textSearchOption = '';
                if (middle_name) {
                    textSearch = items.middle_name.replace(search, `<mark>${option.valSearch}</mark>`);
                }
                if (email) {
                    textSearchOption += items.email.replace(search, `<mark>${option.valSearch}</mark>`);
                }
                if (user_name) {
                    textSearchOption += items.user_name.replace(search, `<mark>${option.valSearch}</mark>`);
                }

                if ((middle_name || email || user_name) === false) return false;
                temp.textSearch = textSearch + (textSearchOption ? (' (' + textSearchOption + ')') : '');
            } else {
                let textSearch = (search.test(items.title)) ? items.title.replace(search, `<mark>${option.valSearch}</mark>`) : null;
                if (textSearch === null) return false;
                temp.textSearch = textSearch;
            }

            listContactSingleSearch.push(temp);
        });

        return listContactSingleSearch;
    };

    this.renderContactListAll = function (modelConversation, option) {
        var contactList = contactListSearch = [];

        let _this = this;
        modelConversation.forEach(function (items) {
            let temp = Object.assign({}, items);
            delete temp.infoAccountParticipant;
            if (items.count === 1) {
                temp.isSingle = true;
                let userParticipant = _this.getAttributeContact(items.infoAccountParticipant);
                contactList.push(Object.assign(temp, userParticipant));
            } else if (items.count > 1) {
                temp.path_img_group = items.infoAccountParticipant[0].relations.useContacts.attributes.path_img_group;
                temp.isSingle = false;
                contactList.push(temp);
            }
        });

        if (option.isSearch === true) {
            contactListSearch = _this.getListContactSingleSearchAll(contactList, option);
        }

        return {contactList: (option.isSearch === true ? contactListSearch : contactList), cfgChat: option.cfg_chat};
    };

    this.getAttributeContact = function (modelUser) {
        let userParticipant = {};
        let useContact = modelUser.relations.useContacts.attributes;
        userParticipant.email = modelUser.attributes.email;
        userParticipant.phone = modelUser.attributes.phone;
        userParticipant.first_name = useContact.first_name;
        userParticipant.last_name = useContact.last_name;
        userParticipant.middle_name = useContact.middle_name;
        userParticipant.mood_message = useContact.mood_message;
        userParticipant.path_img = useContact.path_img;
        userParticipant.path_img_group = useContact.path_img_group;
        userParticipant.status = useContact.status;
        userParticipant.user_name = useContact.user_name;
        userParticipant.is_life = useContact.is_life;

        return userParticipant;
    };
};

module.exports = LibFunction;