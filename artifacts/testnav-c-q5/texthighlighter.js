(function (root, factory) { root.TextHighlighterAPI = factory(); }(this, function () {
/**
 * almond 0.2.5 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());
define("almond", function(){});

define( 'texthighlighter',[],
    function() {

        function TextHighlighter( initConfig ) {
            var _selectedIds = [];
            var _feedbackSelectedIds = [];

            var config = {
                contentDiv: '',
                minChoices: 0,
                maxChoices: 0,
                maxChoicesMessage: "",
                selectable: []
            };

            $.extend( config, initConfig);

            var _selectableIds; // Array of strings
            var _contentDiv = "#" + config.contentDiv;
            var _contentEl;
            var _feedbackEl;

            // Max selectable = 0 means no limit.
            var _maxChoices = 0;
            var _minChoices = 0;

            function _getSelectableIds() {
                return _selectableIds;
            }

            function _getSelectedIds() {
                return _selectedIds;
            }

            function _getContentDiv() {
                return _contentDiv;
            }

            function _getContentEl() {
                return _contentEl;
            }

            function _getMinChoices() {
                return _minChoices;
            }

            function _getMaxChoices() {
                return _maxChoices;
            }

            function init() {
                _contentEl = $( _contentDiv );
                _selectableIds = setSelectableIds( config.selectable );
                makeSelectableElements();
                setupSelectableElements();
                _maxChoices = normalizeChoiceValue( config.maxChoices);
                _minChoices = normalizeChoiceValue( config.minChoices);
                adjustColors();

                setupFeedbackEl();

                window.TN8 && window.TN8.fnOn("tn.exitmodal.show inform.timeoutModalOn tn.error.fatal tn.ews.on", closeGrowls);
                $(document).on('Cleanup.TextHighlighter', destroy);
                $(document).on('getCorrectResponses', getCorrectResponse );
                $(document).on('getFeedbackScore', getFeedbackScore );
            }

            function setupFeedbackEl() {
                if( _contentEl[0] ) {
                    _feedbackEl = _contentEl.clone().attr('id', _contentEl[0].id.replace('interaction_', '')).attr( "data-style", "CustomInteraction-texthighlighter" );

                    var identifier = $('[data-module]').data().identifier;
                    _feedbackEl.data('identifier', identifier + '_feedback');
                };
            }

            function adjustColors() {
                var el = _contentEl.attr( "data-style", "CustomInteraction-texthighlighter" );

                $.each( _selectedIds, function( index, value ) {
                    el.find("[data-identifier='" + value + "'], #" + value).addClass('selectedC').attr('aria-checked', true);
                });
            }

            function adjustFeedbackColors() {
                var el = _feedbackEl.attr( "data-style", "CustomInteraction-texthighlighter" );

                $.each( _feedbackSelectedIds, function( index, value ) {
                    el.find("[data-identifier='" + value + "'], #" + value).addClass('selectedC').attr('aria-checked', true);
                });
            }

            function normalizeChoiceValue( input ) {
                var normalizedValue = 0;

                if( input && typeof( input ) === "number" && input > 0 ) {
                    // Use floor to get rid of any decimal part.
                    normalizedValue = Math.floor( input )
                }
                return normalizedValue

            }

            function setSelectableIds( ids ) {
                var selIds = [];
                if (typeof( ids ) === "string" && ids === "all") {
                    selIds = getAllSpanIds();
                } else if( Array.isArray( ids )) {
                    selIds = ids;
                }
                return selIds;
            }

            function getAllSpanIds() {
                var allSpans = _contentEl.find( "span" ).get();
                var ids = [];
                var curId;

                for( var i = 0; i < allSpans.length; i++ ) {
                    // If data-identifier is being used, then select those elements, 
                    // else select the elements by id;
                    curId = $( allSpans[i] ).attr( "data-identifier" );
                    if ( !curId ) {
                        curId = $( allSpans[i] ).attr( "id" );
                    }
                    if( curId !==null && curId !== "" ) {
                        ids.push( curId );
                    }
                }

                return ids;
            }

            function makeSelectableElements() {
                if( _selectableIds.length > 0 ) {
                    for( var i = 0; i < _selectableIds.length; i++ ) {
                        // If data-identifier is being used, then select those elements, 
                        // else select the elements by id;
                        var selectableElements = $('[data-identifier="'+_selectableIds[i]+'"]');
                        if ( !selectableElements.length ) {
                            selectableElements = $('[id="'+_selectableIds[i]+'"]');
                        }
                        selectableElements.addClass( "selectable" ).attr({
                            "tabIndex": "0",
                            "role": "checkbox",
                            "aria-checked": false
                        });
                        $(selectableElements).on('mouseenter mouseover', function () {
                            $(this).addClass('hover');
                        });
                        $(selectableElements).on('mouseleave mouseout', function () {
                            $(this).removeClass('hover');
                        });
                    }
                }
            }

            function setupSelectableElements() {
                var selectable = _contentEl.find( "span.selectable" );
                selectable.css( "cursor", "pointer" );
                selectable.on('click keyup', onClickSelectable);
            }

            function onClickSelectable(event) {
                if (event.type === "keyup" && !( event.key === "Enter" || event.key === " " )) { return; }

                //Ignore click/keyup events that bubble up from glossary terms
                const ignoreClasses = ".sbac-glossary-plugin, .glossary-term, .glossary-plugin, .keyword-translation";
                if ($(event.target).is(ignoreClasses)) { return; }

                // If data-identifier is being used, then select those elements,
                // else select the elements by id;
                var els = $(this ).attr( "data-identifier" );
                if ( !els ) {
                    els = $(this ).attr( "id" );
                }
                processClickOrTouch( els, event );
            }

            function processClickOrTouch( clickedId, event ) {
                var _removing = false;
                // If data-identifier is being used, then select those elements,
                // else select the elements by id;
                var selectedElements = $.makeArray(_contentEl.find('[data-identifier="'+clickedId+'"]'));
                if ( !selectedElements.length ) {
                    selectedElements = $.makeArray(_contentEl.find('[id="'+clickedId+'"]'));
                }
                if( inSelectedIds( clickedId ) ) {
                    _removing = true;
                    removeSelectedId( clickedId );
                }
                for (var i=0;i<selectedElements.length;i++) {
                    if(_removing) {
                        removeSelectedItem( $(selectedElements[i]), event );
                    } else {
                        processNewlySelectedItem( $(selectedElements[i]), clickedId, event );
                    }
                }
            }

            function removeSelectedItem( selectedSpan, event ) {
                selectedSpan.removeClass('selectedC').attr('aria-checked', false);
                // remove hover class if touch was used to unselect
                if (event.originalEvent.pointerType === 'touch' || event.originalEvent.pointerType === undefined) {
                    selectedSpan.removeClass('hover');
                }
            }

            function addToSelectedIds(id) {
                var exist = false;
                for( var i = 0; i < _selectedIds.length; i++ ) {
                    if( _selectedIds[i] === id ) {
                        exist = true;
                    }
                }
                if(!exist) {
                    _selectedIds.push( id );
                    $(document).trigger('ItemResponseChanged');
                }
            }

            function processNewlySelectedItem( selectedSpan, clickedId, event ) {
                // Max choices of 1 is handeled differently than anything else...
                if( _maxChoices !== 1 && (_maxChoices === 0 || _selectedIds.length < _maxChoices ) ) {
                    selectedSpan.addClass('selectedC').attr('aria-checked', true);
                    addToSelectedIds( clickedId );
                } else if( _maxChoices === 1 ) {
                    // Reset any selected item
                    if( _selectedIds.length > 0 ) {
                        // This will select the element with the data-identifier or the id attributes.
                        var el  = _contentEl.find( "[data-identifier='" + _selectedIds[0] + "'], #" + _selectedIds[0] );
                        removeSelectedItem( el, event );
                        removeSelectedId( _selectedIds[0] );
                    }

                    // Make this the newly selected item.
                    selectedSpan.addClass('selectedC').attr('aria-checked', true);
                    addToSelectedIds( clickedId );
                } else {
                    var cstr = (_maxChoices === 1) ? '' : 's';
                    var message = config.maxChoicesMessage;
                    if(!message) {
                        message = ($.i18n ? $.i18n.t("choiceInteraction:maxChoiceMsg", {count:_maxChoices}) : ('You are permitted a <strong>maximum of ' + _maxChoices + ' choice' + cstr + '</strong> for this question.<br/>Please unselect one of your choices before making another choice.'));
                    }
                    //Limit error msg's to one at a time to avoid excessive screen reader announcements
                    if ($("#jGrowl .closehotspot").length < 1) {
                        $.jGrowl(message, {theme: 'warning closehotspot', life: 5000, sticky: false});
                    }
                }
            }

            function removeSelectedId( id ) {
                var idIndex = -1;
                for( var i = 0; i < _selectedIds.length && idIndex == -1; i++ ) {
                    if( _selectedIds[i] === id ) {
                        idIndex = i;
                    }
                }

                if( idIndex !== -1 ) {
                    _selectedIds.splice( idIndex, 1 );
                    $(document).trigger('ItemResponseChanged');
                    closeGrowls();
                }
            }

            function inSelectedIds( id ) {
                var inSelected = false;

                for( var i = 0; i < _selectedIds.length && !inSelected; i++ ) {
                    if( id === _selectedIds[i] ) {
                        inSelected = true;
                    }
                }

                return inSelected;
            }

            function getCorrectResponse(e, data) {
                var param = findCorrectResponse( data.responses );
                setCorrectResponse(param);
                data.callback && data.callback(_feedbackEl);
            }

            function findCorrectResponse( responses ) {
                var param;

                /* Search the array of correct responses, find the correct on by interaction ID */
                responses.some( function( response, i ) { 
                    /* Create regex to search responses by ID */
                    var regex = response.did + "(?!\\d)";
                    var re = new RegExp(regex,"g");

                    /* Compare this interactions ID against created RegEx */
                    /* Texthighlighter can have options passed to it from a completely different div which holds the response identifier */
                    var responseFound = _feedbackEl[0].id.match(re) || $('[data-module]').data().identifier.match(re);

                    if( responseFound ) {
                        param = response.r;
                        return true;
                    }
                });

                return param;
            }

            function setCorrectResponse( responseData ) {
                var list;

                if( responseData.list && responseData.list.identifier ) {
                    _feedbackSelectedIds = responseData.list.identifier;

                    adjustFeedbackColors();
                }
            }

            function setResponseData( responseData ) {
                var list;

                if( responseData.list && responseData.list.identifier ) {
                    list = responseData.list.identifier;

                    for( var i = 0; i < list.length; i++ ) {
                        // If data-identifier is being used, then select those elements, 
                        // else select the elements by id;
                        var selectedSpans = $.makeArray(_contentEl.find('[data-identifier="'+list[i]+'"]'));
                        if ( !selectedSpans.length ) {
                            selectedSpans = $.makeArray(_contentEl.find('[id="'+list[i]+'"]'));
                        }
                        for( var j = 0; j < selectedSpans.length; j++ ) {
                            addToSelectedIds( list[i] );
                        }
                    }
                    adjustColors();
                }
            }

            function getFeedbackScore( e, data ) {
                var response = getResponseData();
                data.callback && data.callback( {id: $('[data-module]').data().identifier, response: response} );
            }

            function getResponseData() {
                var responseData = {};
                closeGrowls();

                if( _selectedIds.length > 0 ) {
                    responseData.list = { "identifier": _selectedIds };
                }

                return responseData;
            }

            function closeGrowls() {
                $("div.jGrowl").jGrowl("close");
            }

            function getAnswered() {
                if(_minChoices > 0) {
                    return ( _selectedIds.length >= _minChoices );
                } else {
                    return ( _selectedIds.length > 0 );
                }
            }

            function destroy() {
                const $selectables = $(_contentDiv).find('.selectable');
                $selectables.off('mouseenter mouseover', function () {$(this).addClass('hover');});
                $selectables.off('mouseleave mouseout', function () {$(this).removeClass('hover');})
                $selectables.off('click keyup', onClickSelectable);
                $(document).off("tn.exitmodal.show inform.timeoutModalOn tn.error.fatal tn.ews.on", closeGrowls);
                $(document).off('Cleanup.TextHighlighter', destroy);
                $(document).off('getCorrectResponses', getCorrectResponse );
                $(document).off('getFeedbackScore', getFeedbackScore );
                closeGrowls();

                _selectedIds = null;
                _selectableIds = null;
                _contentDiv = null;
                _contentEl.empty();
                _contentEl = null;
                _maxChoices = null;
                _minChoices = null;
            }

            return {
                initialize : init,
                setResponseData: setResponseData,
                getResponseData: getResponseData,
                getAnswered: getAnswered,
                destroy: destroy,
                testing: {
                    getAllSpanIds: getAllSpanIds,
                    getContentDiv: _getContentDiv,
                    getContentEl: _getContentEl,
                    getMinChoices: _getMinChoices,
                    getMaxChoices: _getMaxChoices,
                    getSelectableIds: _getSelectableIds,
                    getSelectedIds: _getSelectedIds,
                    inSelectedIds: inSelectedIds,
                    normalizeChoiceValue: normalizeChoiceValue
                }
            };
        }

        return TextHighlighter;
    } );
/**
 * Text Highlighter
 * Copyright 2014 Pearson Education.
 *
 * Build.version = ${project.version}
 * Build.timestamp = ${timestamp}
 */
define(
  'main',[
      './texthighlighter'
  ],
  function ( TextHighlighter )
  {
    "use strict";

    var TextHighlighterAPI = {};

    TextHighlighterAPI.createTextHighlighter = function( config )
    {
        return new TextHighlighter( config );
    };

    return TextHighlighterAPI;
  });


return require('main'); }));
