/**
 * Module dependencies.
 */
const socketio      = require('socket.io');
const sharedsession = require("express-socket.io-session");
const watson        = require('watson-developer-cloud');
const i18n          = require('i18n');

/**
 * include config
 */
const paths      = require("./paths");
const config     = require(paths.config + "config");
const lang       = require(paths.config + "lang");
const file       = require(paths.config + 'file');

const define     = require(paths.config + 'define');
const controller = require(paths.controllers + 'controller');
const frame      = require(paths.sockets + 'frame');
const sockets    = require(paths.sockets + 'sockets');

const chatsModel = require(paths.models + 'chats');
const usersModel = require(paths.models + 'users');
const chatsTable = new chatsModel.Schema("chats").model;
const usersTable = new usersModel.Schema("users").model;

/**
 * variable
 */
var io;

/* chatbot */
const conversation = watson.conversation(define.WATSON_CONVERSATION);

/**
 * Expose
 */

class Socket {

	configSocket (express_session, server) {
		io = socketio(server);
		io.use(sharedsession(express_session));
		io.on('connection', function (socket) {
			var userchat = sockets.getSessionCustommer(socket);
			/*
			 register User
			 */
			socket.on('addCustommer', function (data) {
				var response = controller.responseSocket();
				response.userchat = userchat;

				if (!data.full_name) {
					response.status = 1;
					response.message = lang.sprintf(lang.is_not_empty, 'Full name');
					response.focus = '[name="full_name"]';
				}

				if (response.status == 0) {
					if (userchat) {
						usersModel.getUser(userchat._id, function (err, user) {
							user.last_name = data.full_name;
							user.email = data.email;
							user.phone = data.phone;
							user.save(function (err, user) {
								if (user) {
									user.total_form = 0;
									user = frame.processCustommers(user, true);

									userchat = user;
									sockets.setSessionCustommer(socket, user);
									response.message = lang.sprintf(lang.update_success, '');
									response.userchat = user;


									socket.emit('updateCustommer', response);
									socket.broadcast.emit('updateCustommerBroadcast', response);
								}
							});
						});
					} else {
						var usersEntity = new usersTable();
						usersEntity.last_name = data.full_name;
						usersEntity.email = data.email;
						usersEntity.phone = data.phone;
						usersEntity.role = define.ROLE_3;
						usersEntity.save(function (err, user) {
							if (user) {
								user.total_form = 0;
								user = frame.processCustommers(user, true);
								userchat = user;

								response.message = lang.sprintf(lang.created_success, '');
								response.userchat = user;

								sockets.setSessionCustommer(socket, user);
								socket.broadcast.emit('addCustommerBroadcast', response);

								/* add message */
								var setting_frame_default = define.CONFIG_FRAME_DEFAULT;
								file.readSettingFrame('setting_frame', function (err, setting_frame) {
									setting_frame = JSON.parse(setting_frame);
									var chatsEntity = new chatsTable();
									var userIdCustommer = user._id;
									chatsEntity.to = userIdCustommer;
									chatsEntity.type_sent = define.CHATBOT;
									chatsEntity.message = setting_frame.first_message ? setting_frame.first_message : setting_frame_default.first_message;
									chatsEntity.read = 0;
									chatsEntity.type = 'text';
									chatsEntity.save(function (err, chat) {
										if (chat) {
											chat.populate('to', define.POPULATE_SELECT_CHATS, function (err, chat) {
												if (chat) {
													response.message = 'success';
													response.data.message = frame.processMessages(chat, true);
													usersModel.updateTotalMessageNew(userIdCustommer, define.CUSTOMMER, function (error, user_update) {
														response.data.custommer = frame.processCustommers(user_update, true);
														socket.emit('newMessage', response);
														socket.broadcast.emit('newMessage', response);
													});
												}
											});
										}
									});
								});
								/* END: add message */

							} else {

								response.message = lang.sprintf(lang.created_failed, '');
								response.status = 1;
								response.focus = '[name="full_name"]';

							}
							socket.emit('addCustommer', response);
						});
					}
				} else {
					socket.emit('addCustommer', response);
				}
			});
			/*
			 new message
			 */
			socket.on('newMessage', function (data) {
				var response = controller.responseSocket();

				if (!userchat && data.type_sent != define.SUPPORT) {
					response.message = lang.sprintf(lang.is_not_empty, 'Full name');
					response.status = 403;
					response.focus = '[name="full_name"]';
					socket.emit('newMessage', response);
				}

				if (response.status == 0 && !data.message) {
					response.message = lang.you_have_not_entered_chat_content;
					response.status = 1;
					response.focus = '[name="message"]';
					socket.emit('newMessage', response);
				}


				if (response.status == 0) {
					if (data.type_sent != define.CUSTOMMER && data.type_sent != define.SUPPORT) {
						response.message = lang.sprintf(lang.send_message_failed, '');
						response.status = 1;
						socket.emit('newMessage', response);
					}
				}

				if (response.status == 0) {
					if (data.type_sent == define.SUPPORT) {
						var userSupport = sockets.getSessionSupport(socket);
						if (!userSupport) {
							response.message = lang.you_are_not_logged_in_system;
							response.status = 403;
						}
					}
				}

				if (response.status == 0) {
					var supportId = '';
					var chatsEntity = new chatsTable();
					var typeCount = '';
					if (data.type_sent == define.CUSTOMMER) {
						var userIdCustommer = userchat._id;
						typeCount = define.SUPPORT;
						chatsEntity.from = userIdCustommer;
						if (userchat.support) {
							chatsEntity.to = userchat.support._id;
						}
					} else if (data.type_sent == define.SUPPORT) {
						var userIdCustommer = data.user_id;
						typeCount = define.CUSTOMMER;
						supportId = userSupport._id;
						chatsEntity.from = supportId;
						chatsEntity.to = userIdCustommer;
					}

					chatsEntity.type_sent = data.type_sent;
					chatsEntity.message = data.message;
					chatsEntity.data = data.data;
					chatsEntity.read = 0;
					chatsEntity.type = 'text';

					usersModel.getUser(userIdCustommer, function (err, user) {
						if (data.type_sent == define.SUPPORT) {
							var condition1 = user;
							var condition2 = user.support && user.support._id == supportId;
							if (!(condition1 && condition2)) {
								response.message = lang.you_can_not_support_this_candidate;
								response.status = 1;
								socket.emit('newMessage', response);
							}
						}

						if (response.status == 0) {
							chatsEntity.save(function (err, chat) {
								if (chat) {
									chat.populate('to', define.POPULATE_SELECT_CHATS)
										.populate('from', define.POPULATE_SELECT_CHATS, function (err, chat) {
											if (chat) {
												response.message = 'success';
												response.data.message = frame.processMessages(chat, true);
												usersModel.updateTotalMessageNew(user._id, typeCount, function (error, user_update) {
													response.data.custommer = frame.processCustommers(user_update, true);
													socket.emit('newMessage', response);
													socket.broadcast.emit('newMessage', response);

													/* code xử lý đẩy sang lấy mgs về */
													if (!user.support && data.type_sent == define.CUSTOMMER) {
														var conversation_request = {
															'input': {text: data.message},
															'context': (data.context ? data.context : {}),
															'workspace_id': define.WATSON_CONVERSATION.workspace_id
														};

														conversation.message(conversation_request, function (err, conversation_response) {

															if (conversation_response) {
																response.data.conversation = conversation_response;

																var output = conversation_response.output;
																var chatsEntity = new chatsTable();
																chatsEntity.to = userIdCustommer;
																chatsEntity.type_sent = define.CHATBOT;
																chatsEntity.message = output.text;
																chatsEntity.read = 0;
																chatsEntity.type = 'text';
																chatsEntity.save(function (err, chat) {
																	if (chat) {
																		chat.populate('to', define.POPULATE_SELECT_CHATS, function (err, chat) {
																			if (chat) {
																				response.message = 'success';
																				response.data.message = frame.processMessages(chat, true);
																				usersModel.updateTotalMessageNew(userIdCustommer, define.CUSTOMMER, function (error, user_update) {
																					response.data.custommer = frame.processCustommers(user_update, true);
																					socket.emit('newMessage', response);
																					socket.broadcast.emit('newMessage', response);
																				});
																			}
																		});
																	}
																});
															}
														});
													}
													/* END: code xử lý đẩy sang lấy mgs về */
												});
											} else {
												response.message = lang.sprintf(lang.send_message_failed, '');
												response.status = 1;
												socket.emit('newMessage', response);
											}
										});
								} else {
									response.message = lang.sprintf(lang.invalid, 'ID');
									response.status = 1;
									socket.emit('newMessage', response);
								}
							});
						}
					});
				}
			});

			socket.on('typing', function (data) {
				var response = controller.responseSocket();
				if (userchat || data.type_sent == define.SUPPORT) {
					if (data.type_sent == define.CUSTOMMER) {
						response.custommer_id = userchat._id;
						response.user = frame.processCustommers(userchat, true);
						socket.broadcast.emit('typingBroadcast', response);
					} else if (data.type_sent == define.SUPPORT) {
						response.custommer_id = data.user_id;
						var userSupport = sockets.getSessionSupport(socket);
						var user_id = userSupport._id;
						usersModel.getUser(user_id, function (err, user) {
							if (user) {
								response.user = frame.processCustommers(user, true);
								socket.broadcast.emit('typingBroadcast', response);
							}
						});
					}
				} else {
					response.message = lang.sprintf(lang.is_not_empty, 'Full name');
					response.status = 403;
					response.focus = '[name="full_name"]';
					socket.emit('typing', response);
				}
			});

			socket.on('stop_typing', function (data) {
				var response = controller.responseSocket();
				if (userchat || data.type_sent == define.SUPPORT) {
					if (data.type_sent == define.CUSTOMMER) {
						response.custommer_id = userchat._id;
						response.user = userchat;
						socket.broadcast.emit('stopTypingBroadcast', response);
					} else if (data.type_sent == define.SUPPORT) {
						response.custommer_id = data.user_id;
						var userSupport = sockets.getSessionSupport(socket);
						var user_id = userSupport._id;
						usersModel.getUser(user_id, function (err, user) {
							if (user) {
								response.user = frame.processCustommers(user, true);
								socket.broadcast.emit('stopTypingBroadcast', response);
							}
						});
					}
				} else {
					response.message = lang.sprintf(lang.is_not_empty, 'Full name');
					response.status = 403;
					response.focus = '[name="full_name"]';
				}
				socket.emit('stopTyping', response);
			});

			socket.on('approvalSupport', function (data) {
				var response = controller.responseSocket();

				if (!data.custommer || !data.support) {
					response.message = lang.incorrect_data;
					response.status = 1;
				}

				if (response.status == 0) {
					usersModel.getUser(data.custommer, function (err, user) {
						if (user && !user.support) {
							user.support = data.support;
							user.save(function (err, user) {
								if (user) {
									user.populate('support', define.POPULATE_SELECT_SUPPORT, function (err, user) {
										response.user = frame.processCustommers(user, true);
										socket.broadcast.emit('approvalSupportBroadcast', response);
										socket.emit('approvalSupport', response);
										response.message = lang.confirm_success;
									});
								} else {
									response.message = lang.confirmation_failed;
									response.status = 1;
									socket.emit('approvalSupport', response);
								}
							});
						} else {
							response.message = lang.incorrect_data;
							response.status = 1;
							socket.emit('approvalSupport', response);
						}
					});
				} else {
					socket.emit('approvalSupport', response);
				}
			});

			socket.on('updateInfoCustommer', function (data) {
				var response = controller.responseSocket();

				if (!data.custommer) {
					response.message = lang.incorrect_data;
					response.status = 1;
				}

				if (response.status == 0) {
					usersModel.getUser(data.custommer, function (err, user) {
						if (user) {
							sockets.setSessionCustommer(socket, user);
							response.message = 'Success';
							socket.emit('updateInfoCustommer', response);
						}
					});
				} else {
					socket.emit('updateInfoCustommer', response);
				}

			});

			socket.on('minmaximize', function (data) {
				var response = controller.responseSocket();

				if (!data.type) {
					response.message = lang.incorrect_data;
					response.status = 1;
				}

				if (response.status == 0) {
					socket.handshake.session.chatsFrame = {resize: data.type};
					socket.handshake.session.save();
				}
				socket.emit('minmaximize', response);
			});

			socket.on('updateRead', function (data) {
				var response = controller.responseSocket();
				var custommerId = data.custommerId;
				var type = data.type;
				usersModel.getUser(custommerId, function (err, user) {
					if (user && !(type == define.SUPPORT && !user.support)) {
						chatsModel.updateIsSeem(custommerId, {}, type, function (err, numAffected) {
							if (numAffected) {
								usersModel.updateTotalMessageNew(custommerId, type, function (error, user_update) {
									response.data.type = type;
									response.data.custommer = frame.processCustommers(user_update, true);
									socket.emit('updateRead', response);
								});
							}
						});
					}
				});
			});
		});
	}
}

module.exports = Socket;