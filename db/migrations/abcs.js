'use strict';
exports.up = function (knex) {
    return knex.schema
        .createTable('abcs', function (table) {
            table.increments('id').primary();
            table.string('firstName');
            table.string('lastName');
            table.string('emailAddress');
        });
};
exports.down = function (knex) {
    return knex.schema
        .dropTable('abcs');
};

//node_modules/.bin/