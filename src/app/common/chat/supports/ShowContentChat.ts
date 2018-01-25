'use strict';

declare var jQuery: any;
declare var $: any;
declare var require: any;


export class ShowContentChat {

    supportHeaderHtmlContentChat(dataHeaderContentChat) {
        let supportHtmlProfile = '';
        if (dataHeaderContentChat.listParticipant.length) {
            dataHeaderContentChat.listParticipant.forEach((element) => {
                supportHtmlProfile += '<i channel="status.' + dataHeaderContentChat.dataChannelId + '" class="favorite-conversation ' + element.classStatus + '"'
                    + 'codePartId="' + element.codePartId + '" code-participant-id="' + element.users_id + '" aria-hidden="true"></i>';
                supportHtmlProfile += '<div class="info-group"><span class="status-name">' + element.moodMessageShow + '</span><span class="status-space">|</span><span class="status-other">fsgsgsgs</span></div>';
            });
        }

        return supportHtmlProfile;
    }

    headerHtmlContentChat(reqDataContentChat) {
        let htmlProfile = '<div class="contact-profile">'
            + '<img id="participant-profile" src="' + reqDataContentChat.urlImagesAvatar + '" alt="" data-toggle="modal" data-target="#show-information-conversation"/>'
            + '<div class="info-conversation-participant">';

        htmlProfile += '<div class="info-participant">'
            + '<input class="star favorite-participant" type="checkbox" title="bookmark users" checked/>'
            + '<p>' + reqDataContentChat.userName + '</p></div>';

        htmlProfile += '<div id="extend-participant" class="info-conversation' + (reqDataContentChat.isTypeSingle ? "" : " cursor") + '">';

        if (reqDataContentChat.booleanConversation) {
            if (reqDataContentChat.isTypeSingle) {
                htmlProfile += this.supportHeaderHtmlContentChat(reqDataContentChat);
            } else {
                htmlProfile += '<i class="favorite-conversation fa fa-plus" aria-hidden="true"></i>'
                    + '<div class="info-group"><span>' + reqDataContentChat.countParticipants + ' Participants</span><span class="status-space">|</span><span class="status-other">fsgsgsgs</span></div>';
            }
        } else {
            htmlProfile += this.supportHeaderHtmlContentChat(reqDataContentChat);
        }

        htmlProfile += '</div></div>';

        htmlProfile += '<div class="social-media">'
            + '<div class="social-media">'
            + '<i class="fa fa-facebook" aria-hidden="true"></i>'
            + '<i class="fa fa-twitter" aria-hidden="true"></i>'
            + '<i class="fa fa-instagram" aria-hidden="true"></i>';
        if (reqDataContentChat.booleanConversation) {
            htmlProfile += '<i id="list-contact-your" class="fa ' + (reqDataContentChat.isTypeSingle ? (reqDataContentChat.isFriendCurrentSingle ? "plus-group" : "") : "plus-user") + '"'
                + 'aria-hidden="true" title="' + (reqDataContentChat.isTypeSingle ? "Create group" : "Add user") + '" data-toggle="modal" data-target="#list-friend-yours"></i>';
        }
        htmlProfile += '</div></div>';
        htmlProfile += '</div>';

        if (reqDataContentChat.booleanConversation) {
            if (!reqDataContentChat.isTypeSingle) {
                htmlProfile += '<div class="clearfix"></div><div id="group-participant" class="display-none">'
                    + '<ul class="list-group-part">';

                if (reqDataContentChat.listParticipant.length) {
                    reqDataContentChat.listParticipant.forEach((ele) => {
                        htmlProfile += '<li data-id="' + ele.conversationID + '" class="task info-contextmenu info-part show-info-participants">'
                            + '<span data-conversation="' + ele.conversationID + '" data-channel="' + ele.channelID + '"'
                            + 'data-author="' + ele.users_id + '" data-username="' + ele.middle_name + '"'
                            + 'codePartId="' + ele.codePartId + '" code-participant-id="' + ele.users_id + '"'
                            + 'channel="status.' + (ele.isFriendCurrent ? ele.channelID : "") + '"'
                            + 'class="status-info-part stype-list ' + ele.classStatus + '"></span>'
                            + '<span class="status-info-name">' + ele.middle_name + '</span></li>';
                    });
                }
                htmlProfile += ' </ul></div>';
            }
        }

        return htmlProfile;
    }

    htmlBoxContentChat(reqBoxContentChat) {
        let htmlBoxContentChat = '<div class="messages" id="frameListMsg" box-raw-msg="' + reqBoxContentChat.minHeightBoxChat + '"'
            + 'page="' + reqBoxContentChat.page + '" box-change-msg="' + reqBoxContentChat.minHeightBoxChat + '">';

        if (reqBoxContentChat.booleanConversation) {
            if (reqBoxContentChat.isFriendCurrentSingle) {
                htmlBoxContentChat += '<ul id="boxMsgChat"></ul>';
            } else {
                if (reqBoxContentChat.isCurrentOwnerId) {
                    htmlBoxContentChat += '<div class="send-request-user">contact request sent - <a class="">Resend contact request</a></div>';
                } else {
                    htmlBoxContentChat += '<div class="clearfix"></div><div class="" id="request-area">'
                        + '<div class="accept-request-user">'
                        + '<div class="d-block md-col-12" align="center">'
                        + '<span>sslskgmjslgk</span>'
                        + '<button class="btn btn-primary" id="reply-decline-user">decline</button>'
                        + '<button class="btn btn-primary" id="reply-accept-user">accept</button>'
                        + '</div></div></div>';
                }
            }
        } else {
            //NOT FRIEND
            htmlBoxContentChat += '<div class="clearfix"></div>';
            htmlBoxContentChat += '<div class="" id="request-area">'
                + '<div class="accept-request-user">'
                + '<div class="d-block md-col-12" align="center">'
                + '<span><p class="name-partici-req">' + reqBoxContentChat.userName + '</p> is not in your contacts</span>'
                + '<button class="btn btn-primary" id="add-contact-user">Add to contacts</button>';
            htmlBoxContentChat += '</div></div></div>';
        }

        htmlBoxContentChat += '</div>';
        return htmlBoxContentChat;
    }

    htmlActionContentChat(reqData) {
        let htmlActionContentChat = '<div class="message-input" id="messageInput" data-conversation="' + reqData.dataConversation + '"'
            + 'data-channel="' + reqData.dataChannelId + '" data-owner="' + reqData.dataOwnerId + '" data-type="' + reqData.dataType + '">';

        htmlActionContentChat += '<div class="wrap">';

        htmlActionContentChat += '<div class="scrollbar" id="style-box-sms" max-height="' + reqData.maxHeightBoxChat + '" min-height="' + reqData.minHeightBoxChat + '">'
            + '<textarea id="boxChat" class="box_msg" type="text" placeholder="Write your message..."></textarea></div>';

        //--------------------------
        if (reqData.booleanConversation) {
            htmlActionContentChat += '<div class="btn-controler-act"><ul class="_552n">';
            htmlActionContentChat += '<li class="_13gd "><form action="#" class="_vzk" title="Add Files" method="post">'
                + '<input type="hidden" name="attach_id" value="">'
                + '<input type="hidden" name="images_only" value="false">'
                + '<div class="ms_img"><input id="add_f" type="file" class="" name="attachment[]" multiple="" accept="*" title="Add Files">'
                + '<label for="add_f" class="_4q61 _6gb _6gg attachment-cst r_file90" tabindex="-1" href="#"><i class="hidden_elem" alt="Camera"></i></label>'
                + '</div>'
                + '</form></li>';

            htmlActionContentChat += '<li class="_13f- "><form action="#" class="_vzk" title="Add Photos" method="post">'
                + '<input type="hidden" name="attach_id" value="">'
                + '<input type="hidden" name="images_only" value="true">'
                + '<div class="ms_img"><input id="add_i" type="file" class="" name="attachment[]" multiple="" accept="image/*" title="Add Photos">'
                + '<label for="add_i" class="_4q61 _6gb _6ge attachment-cst r_img70" tabindex="-1" href="#"><i class="hidden_elem" alt="Camera"></i></label>'
                + '</div>'
                + '</form></li>';


            htmlActionContentChat += '<li class="_13gg ">'
                + '<a class="_6gb _3oxr attachment-cst r_emoji50" role="button" title="Choose an emoji" href="#"><i class="" aria-hidden="true"></i></a>'
                + '</li>';

            htmlActionContentChat += '<li class="_13gg ">'
                + '<a id="sendMessageChat" class="sms-send"><div class="submit attachment-cst r_bt25"><i class="fa fa-paper-plane" aria-hidden="true"></i></div></a>'
                + '</li>';

            htmlActionContentChat += '</ul></div>';
        }
        //-------------------------------
        htmlActionContentChat += '</div></div>';
        htmlActionContentChat += '<div id="newMsgChat" style="display: none"><div class="bs"><a id="notifyNewsSms" title="news message">news message</a></div></div>';
        htmlActionContentChat += '<div id="create-tooltip" class="cus-tooltip"><div class="uiContextualLayer"><span class="tooltiptext" style="display: none"></span></div></div>';
        htmlActionContentChat += '<div id="list-your-friend"></div>';

        return htmlActionContentChat;
    }

    htmlActionMenuContentChat() {
        let htmlMenu = '<div id="menu">'
            + '<a href="#"><img src="http://puu.sh/nr60s/42df867bf3.png"/> AdBlock Plus <span>Ctrl + ?!</span></a>'
            + '<a href="#"><img src="http://puu.sh/nr5Z6/4360098fc1.png"/> SNTX <span>Ctrl + ?!</span></a>'
            + '<hr/>'
            + '<a href="#"><i class="fa fa-fort-awesome"></i> Fort Awesome <span>Ctrl + ?!</span></a>'
            + '<a href="#"><i class="fa fa-flag"></i> Font Awesome <span>Ctrl + ?!</span></a>'
            + '</div>';

        return htmlMenu;
    }

    getShowContentChat(dataResult) {
        return this.headerHtmlContentChat(dataResult)
            + this.htmlBoxContentChat(dataResult)
            + this.htmlActionContentChat(dataResult)
            + this.htmlActionMenuContentChat();
    }
}