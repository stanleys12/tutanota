import m, { Component, Vnode } from "mithril"
import { lang } from "../../../../ui/utils/LanguageViewModel"
import { TitleSection } from "../../../../ui/TitleSection"
import { Icons } from "../../../../ui/base/icons/Icons"
import { theme } from "../../../../ui/theme"
import { PrimaryButton, SecondaryButton } from "../../../../ui/base/buttons/VariantButtons.js"
import { Dialog } from "../../../../ui/base/Dialog"
import { Keys } from "../../../../ui/utils/KeyboardKeys"
import { SectionButton } from "../../../../ui/base/buttons/SectionButton"
import { px, size } from "../../../../ui/size"

export function showDeleteFolderPopup(mailSetName: string, affectedInboxRuleNames: string[]): Promise<boolean> {
	return new Promise((resolve) => {
		const dialog: Dialog = Dialog.editMediumDialog(
			{
				middle: "confirmTrashAction_label",
			},
			DeleteMailSetDialog,
			{
				mailSetName,
				affectedInboxRuleNames,
				deletionChoice: (continueDeletion: boolean) => {
					resolve(continueDeletion)
					dialog.close()
				},
			},
			{ backgroundColor: theme.surface_container },
		)
			.addShortcut({
				key: Keys.ESC,
				exec: () => {
					resolve(false)
					dialog.close()
				},
				help: "close_alt",
			})
			.setCloseHandler(() => {
				resolve(false)
				dialog.close()
			})

		dialog.show()
	})
}

interface DeleteMailSetDialogAttrs {
	mailSetName: string
	affectedInboxRuleNames: string[]
	deletionChoice: (continueDeletion: boolean) => void
}

class DeleteMailSetDialog implements Component<DeleteMailSetDialogAttrs> {
	view({ attrs }: Vnode<DeleteMailSetDialogAttrs>) {
		return m(".pt-16.pb-16.flex.col.gap-16", { style: { backgroundColor: theme.surface_container } }, [
			m(TitleSection, {
				title: "",
				subTitle: lang.getTranslation("confirmMoveFolderToTrash_msg", { "{1}": attrs.mailSetName }).text,
				icon: Icons.ExclamationOutline,
				iconOptions: { color: theme.error },
			}),
			attrs.affectedInboxRuleNames.length > 0
				? m(SectionButton, {
						leftIcon: { icon: Icons.FunnelFilled, title: "inboxRulesSettings_action" },
						text: lang.getTranslation("deactivateInboxRules_msg", { "{1}": attrs.affectedInboxRuleNames.length }),
						// injectionRight: model.editModels.whoModel.guests.length > 0 ? m("span", model.editModels.whoModel.guests.length) : null,
						onclick: () => {
							// FIXME this.transitionTo(EditorPages.GUESTS, navigationCallback)
						},
						style: {
							minHeight: px(size.core_48),
						},
						cardStyle: {
							padding: px(size.spacing_12),
						},
					})
				: null,
			m(".flex.row.gap-8", [
				m(SecondaryButton, {
					class: "flex-grow center-vertically",
					label: "cancel_action",
					onclick: () => {
						attrs.deletionChoice(false)
					},
				}),
				m(PrimaryButton, {
					class: "flex-grow center-vertically",
					label: "delete_action",
					onclick: () => {
						attrs.deletionChoice(true)
					},
				}),
			]),
		])
	}
}
