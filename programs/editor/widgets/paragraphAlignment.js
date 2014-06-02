/**
 * Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>
 *
 * @licstart
 * This file is part of WebODF.
 *
 * WebODF is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License (GNU AGPL)
 * as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * WebODF is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WebODF.  If not, see <http://www.gnu.org/licenses/>.
 * @licend
 *
 * @source: http://www.webodf.org/
 * @source: https://github.com/kogmbh/WebODF/
 */

/*global define,require,ops,gui */

define("webodf/editor/widgets/paragraphAlignment", [
    "dijit/form/ToggleButton",
    "dijit/form/Button",
    "webodf/editor/EditorSession"],

    function (ToggleButton, Button, EditorSession) {
        "use strict";

        var ParagraphAlignment = function (callback) {
            var self = this,
                editorSession,
                widget = {},
                directFormattingController,
                justifyLeft,
                justifyCenter,
                justifyRight,
                justifyFull,
                indent,
                outdent;

            justifyLeft = new ToggleButton({
                label: runtime.tr('Align Left'),
                disabled: true,
                showLabel: false,
                checked: false,
                iconClass: "dijitEditorIcon dijitEditorIconJustifyLeft",
                onChange: function () {
                    directFormattingController.alignParagraphLeft();
                    self.onToolDone();
                }
            });

            justifyCenter = new ToggleButton({
                label: runtime.tr('Center'),
                disabled: true,
                showLabel: false,
                checked: false,
                iconClass: "dijitEditorIcon dijitEditorIconJustifyCenter",
                onChange: function () {
                    directFormattingController.alignParagraphCenter();
                    self.onToolDone();
                }
            });

            justifyRight = new ToggleButton({
                label: runtime.tr('Align Right'),
                disabled: true,
                showLabel: false,
                checked: false,
                iconClass: "dijitEditorIcon dijitEditorIconJustifyRight",
                onChange: function () {
                    directFormattingController.alignParagraphRight();
                    self.onToolDone();
                }
            });

            justifyFull = new ToggleButton({
                label: runtime.tr('Justify'),
                disabled: true,
                showLabel: false,
                checked: false,
                iconClass: "dijitEditorIcon dijitEditorIconJustifyFull",
                onChange: function () {
                    directFormattingController.alignParagraphJustified();
                    self.onToolDone();
                }
            });

            outdent = new Button({
                label: runtime.tr('Decrease Indent'),
                disabled: true,
                showLabel: false,
                iconClass: "dijitEditorIcon dijitEditorIconOutdent",
                onClick: function () {
                    directFormattingController.outdent();
                    self.onToolDone();
                }
            });

            indent = new Button({
                label: runtime.tr('Increase Indent'),
                disabled: true,
                showLabel: false,
                iconClass: "dijitEditorIcon dijitEditorIconIndent",
                onClick: function () {
                    directFormattingController.indent();
                    self.onToolDone();
                }
            });

            widget.children = [justifyLeft,
                justifyCenter,
                justifyRight,
                justifyFull,
                outdent,
                indent
            ];

            widget.startup = function () {
                widget.children.forEach(function (element) {
                    element.startup();
                });
            };

            widget.placeAt = function (container) {
                widget.children.forEach(function (element) {
                    element.placeAt(container);
                });
                return widget;
            };

            function updateStyleButtons(changes) {
                var buttons = {
                    isAlignedLeft: justifyLeft,
                    isAlignedCenter: justifyCenter,
                    isAlignedRight: justifyRight,
                    isAlignedJustified: justifyFull
                };

                Object.keys(changes).forEach(function (key) {
                    var button = buttons[key];
                    if (button) {
                        // The 3rd parameter to set(...) is false to avoid firing onChange when setting the value programmatically.
                        button.set('checked', changes[key], false);
                    }
                });
            }

            function handleCursorMoved(cursor) {
                var disabled = cursor.getSelectionType() === ops.OdtCursor.RegionSelection;
                widget.children.forEach(function (element) {
                    element.setAttribute('disabled', disabled);
                });
            }

            this.setEditorSession = function (session) {
                if (directFormattingController) {
                    directFormattingController.unsubscribe(gui.DirectFormattingController.paragraphStylingChanged, updateStyleButtons);
                }
                directFormattingController = session && session.sessionController.getDirectFormattingController();
                if (directFormattingController) {
                    directFormattingController.subscribe(gui.DirectFormattingController.paragraphStylingChanged, updateStyleButtons);
                }
                widget.children.forEach(function (element) {
                    element.setAttribute('disabled', !directFormattingController);
                });
                updateStyleButtons({
                    isAlignedLeft:      directFormattingController ? directFormattingController.isAlignedLeft() :      false,
                    isAlignedCenter:    directFormattingController ? directFormattingController.isAlignedCenter() :    false,
                    isAlignedRight:     directFormattingController ? directFormattingController.isAlignedRight() :     false,
                    isAlignedJustified: directFormattingController ? directFormattingController.isAlignedJustified() : false
                });

                if (editorSession) {
                    editorSession.unsubscribe(EditorSession.signalCursorMoved, handleCursorMoved);
                }
                editorSession = session;
                if (editorSession) {
                    editorSession.subscribe(EditorSession.signalCursorMoved, handleCursorMoved);
                }
            };

            this.onToolDone = function () {};

            callback(widget);
        };

        return ParagraphAlignment;
});
