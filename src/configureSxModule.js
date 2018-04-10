define([
	'fontoxml-families/configureAsFrame',
	'fontoxml-families/configureAsSheetFrame',
	'fontoxml-families/configureAsStructure',
	'fontoxml-families/configureAsTitleFrame',
	'fontoxml-families/configureContextualOperations',
	'fontoxml-families/createMarkupLabelWidget',
	'fontoxml-families/createRelatedNodesQueryWidget',
	'fontoxml-localization/t'
], function (
	configureAsFrame,
	configureAsSheetFrame,
	configureAsStructure,
	configureAsTitleFrame,
	configureContextualOperations,
	createMarkupLabelWidget,
	createRelatedNodesQueryWidget,
	t
	) {
	'use strict';

	return function configureSxModule (sxModule) {
		// learningContent
		//     A Learning Content topic provides the learning content itself, and enables direct use of content
		//     from DITA task, concept, and reference topics, as well as additional content of any topic type that
		//     supports specific objectives declared in the Learning Overview topic type. A Learning Content topic
		//     comprises a set of self-contained content about a single terminal learning objective supported by
		//     zero or more enabling learning objectives.
		configureAsSheetFrame(sxModule, 'self::learningContent', t('learning content'), {
			defaultTextContainer: 'learningContentbody',
			titleQuery: './title//text()[not(ancestor::*[name() = ("sort-at", "draft-comment", "foreign", "unknown", "required-cleanup", "image")])]/string() => string-join()',
			blockFooter: [
				createRelatedNodesQueryWidget('./related-links'),
				createRelatedNodesQueryWidget('descendant::fn[not(@conref) and fonto:in-inline-layout(.)]')
			],
			blockHeaderLeft: [
				createMarkupLabelWidget()
			]
		});

		// learningContent nested in topic
		configureAsFrame(sxModule, 'self::learningContent and ancestor::*[fonto:dita-class(., "topic/topic")]', undefined, {
			defaultTextContainer: 'learningContentbody',
			blockFooter: [
				createRelatedNodesQueryWidget('./related-links')
			],
			blockHeaderLeft: [
				createMarkupLabelWidget()
			]
		});

		// title in learningContent
		configureAsTitleFrame(sxModule, 'self::title[parent::learningContent]', undefined, {
			fontVariation: 'document-title'
		});

		// learningContentbody
		//     The <learningContentbody> element is the main body-level element in a learningContent topic.
		configureAsStructure(sxModule, 'self::learningContentbody', t('body'), {
			defaultTextContainer: 'section',
			ignoredForNavigationNextToSelector: 'false()',
			isRemovableIfEmpty: false
		});

		// section in learningContentbody
		configureContextualOperations(sxModule, 'self::section[parent::learningContentbody]', [
			{ name: ':section-insert-title' },
			{ name: ':contextual-delete-section' }
		]);
	};
});
