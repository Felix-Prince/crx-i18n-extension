/*global saveAs*/
import React, { Component } from "react";
import styles from "./index.module.css";
import { Select, Input, Button, Icon, message } from "antd";
import {
	translation,
	selectedElement,
	setStorage,
} from "../../popup/index";
import locales from "./locales";
import { debounce } from "lodash";

const { Option } = Select;
const { TextArea } = Input;

export default class Translation extends Component {
	state = {
		sourceContent: "",
		targetContent: "",
		dataKey: "",
		toLang: "en",
	};

	componentDidMount() {
		if (selectedElement() && selectedElement().text) {
			const { toLang } = this.state;
			console.log("selectElement", selectedElement());
			translation(
				{ text: selectedElement().text, to: toLang },
				selectedElement().dataKey,
				(result) => {
					this.setState({
						targetContent: result.value,
						filename: result.filename,
					});
					// this.handleChange(result, "targetContent")
				}
			);
			this.setState({
				sourceContent: selectedElement().text,
				dataKey: selectedElement().dataKey,
			});
		}
	}

	saveEdit = () => {
		const { targetContent, dataKey, toLang, filename } = this.state;
		if (!filename) {
			message.info("翻译来自 google ，请去选项配置页面增加相应词条！");
		}
		if (dataKey) {
			setStorage(toLang, filename, { [dataKey]: targetContent });
			message.info("词条修改成功！")
		}
	};

	debounceChange = debounce((value, type) => {
		const { toLang } = this.state;
		type === "sourceContent" &&
			translation(
				{ text: value, to: toLang },
				this.state.dataKey,
				(result) => this.handleChange(result, "targetContent")
			);
	}, 500);

	handleChange = (value, type) => {
		this.setState({
			[type]: value,
		});
		this.debounceChange(value, type);
	};

	changeLang = (value, key) => {
		this.setState({
			[key]: value,
		});
		const { sourceContent, dataKey } = this.state;
		translation(
			{
				text: sourceContent,
				to: value,
			},
			dataKey,
			(result) => this.handleChange(result, "targetContent")
		);
	};

	render() {
		const { sourceContent, targetContent, filename } = this.state;

		return (
			<div className={styles.tlContainer}>
				<div className={styles.tlHeader}>
					<h2>翻译</h2>
					<Select
						style={{ width: 200 }}
						placeholder="目标翻译语言(默认en)"
						onChange={(value) => this.changeLang(value, "toLang")}
					>
						{locales.map((item) => {
							return (
								<Option
									key={item.localeId}
									value={item.localeId}
								>
									{item["zh-CN"]}
								</Option>
							);
						})}
					</Select>
				</div>
				<div className={styles.tlBody}>
					<div className={styles.sourceContent}>
						<TextArea
							rows={4}
							id="sourceContent"
							value={sourceContent}
							placeholder="中文文案"
							onChange={(e) =>
								this.handleChange(
									e.target.value,
									"sourceContent"
								)
							}
						/>
					</div>
					<hr />
					<div className={styles.targetContent}>
						<TextArea
							rows={4}
							id="targetContent"
							value={targetContent}
							placeholder="目标文案"
							onChange={(e) =>
								this.handleChange(
									e.target.value,
									"targetContent"
								)
							}
						/>
						{/* 这里还有一个用处， 没有这个 targetContent 的输入会有问题 */}
						<Input
							disabled
							value={`词条文案来自 ${
								filename ? filename + " 文件" : "google 翻译"
							}`}
						/>
					</div>
					{/* <div className={styles.chooseYaml}>
						<Select
							size="small"
							placeholder="请选择导出的语言包"
							style={{ width: 280 }}
						>
							<Option value="zh-CN">中文</Option>
							<Option value="en">英文</Option>
						</Select>
					</div> */}
				</div>
				<div className={styles.tlAction}>
					<Button onClick={this.saveEdit}>
						<Icon type="save" />
						保存
					</Button>
				</div>
			</div>
		);
	}
}
