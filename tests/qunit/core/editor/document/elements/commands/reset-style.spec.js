import DocumentHelper from '../../helper';
import HistoryHelper from '../../history/helper';
import { DEFAULT_DEBOUNCE_DELAY } from '../../../../../../../assets/dev/js/editor/document/commands/base/debounce';

export const ResetStyle = () => {
	QUnit.module( 'ResetStyle', () => {
		QUnit.module( 'Single Selection', () => {
			QUnit.test( 'Simple', ( assert ) => {
				const eButtonStyled = DocumentHelper.createAutoButtonStyled();

				// Ensure editor saver.
				elementor.saver.setFlagEditorChange( false );

				DocumentHelper.resetStyle( eButtonStyled );

				const done = assert.async(); // Pause the test till done.

				setTimeout( () => {
					// Check pasted style exist.
					assert.equal( eButtonStyled.settings.attributes.background_color, '',
						'Button with custom style were (style) restored.' );
					assert.equal( elementor.saver.isEditorChanged(), true,
						'Command applied the saver editor is changed.' );

					done();
				}, DEFAULT_DEBOUNCE_DELAY );
			} );

			QUnit.test( 'History', ( assert ) => {
				const eWidgetStyled = DocumentHelper.createAutoButtonStyled(),
					BackgroundBeforeReset = eWidgetStyled.settings.get( 'background_color' ); // Black

				DocumentHelper.resetStyle( eWidgetStyled );

				const done = assert.async(); // Pause the test till done.

				setTimeout( () => {
					//const BackgroundAfterReset = eWidgetStyled.settings.get( 'background_color' ), // No Color

					const historyItem = elementor.history.history.getItems().at( 0 ).attributes;

					// Exist in history.
					HistoryHelper.inHistoryValidate( assert, historyItem, 'reset_style', 'Button' );

					// Undo.
					HistoryHelper.undoValidate( assert, historyItem );

					assert.equal( eWidgetStyled.settings.get( 'background_color' ), BackgroundBeforeReset,
						'Settings back to default.' );

					// Redo.
					HistoryHelper.redoValidate( assert, historyItem );

					/*assert.equal( eWidgetStyled.settings.get( 'background_color' ), BackgroundAfterReset,
						'Settings restored.' ); // TODO: in tests its not back to default color.*/

					done();
				}, DEFAULT_DEBOUNCE_DELAY );
			} );
		} );

		QUnit.module( 'Multiple Selection', () => {
			QUnit.test( 'Simple', ( assert ) => {
				const eButtonStyled1 = DocumentHelper.createAutoButtonStyled(),
					eButtonStyled2 = DocumentHelper.createAutoButtonStyled();

				DocumentHelper.multiResetStyle( [ eButtonStyled1, eButtonStyled2 ] );

				const done = assert.async(); // Pause the test till done.

				setTimeout( () => {
					// Check pasted style exist.
					assert.equal( eButtonStyled1.model.attributes.settings.attributes.background_color, '',
						'Button #1 with custom style were (style) restored.' );
					assert.equal( eButtonStyled2.model.attributes.settings.attributes.background_color, '',
						'Button #2 with custom style were (style) restored.' );

					done();
				}, DEFAULT_DEBOUNCE_DELAY );
			} );

			QUnit.test( 'History', ( assert ) => {
				const eWidgetsStyled = DocumentHelper.multiCreateAutoButtonStyled(),
					backgroundBeforeReset = eWidgetsStyled[ 0 ].settings.get( 'background_color' );

				DocumentHelper.multiResetStyle( eWidgetsStyled );

				const done = assert.async(); // Pause the test till done.

				setTimeout( () => {
					const backgroundAfterReset = eWidgetsStyled[ 0 ].settings.get( 'background_color' ),
						historyItem = elementor.history.history.getItems().at( 0 ).attributes;

					// Exist in history.
					HistoryHelper.inHistoryValidate( assert, historyItem, 'reset_style', 'elements' );

					// Undo.
					HistoryHelper.undoValidate( assert, historyItem );

					eWidgetsStyled.forEach( ( eWidgetStyled ) => {
						assert.equal( eWidgetStyled.settings.get( 'background_color' ), backgroundBeforeReset,
							'Settings back to default.' );
					} );

					// Redo.
					HistoryHelper.redoValidate( assert, historyItem );

					eWidgetsStyled.forEach( ( eWidgetStyled ) => {
						assert.equal( eWidgetStyled.settings.get( 'background_color' ), backgroundAfterReset,
							'Settings restored.' );
					} );

					done();
				}, DEFAULT_DEBOUNCE_DELAY );
			} );
		} );
	} );
};

export default ResetStyle;
