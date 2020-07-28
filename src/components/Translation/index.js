/*global saveAs*/
import React, { Component } from "react";
import styles from "./index.module.css";
import { Select, Input, Button, Icon, Upload } from "antd";
import {
	translation,
	selectedElement,
	setStorage,
	getStorage,
	exportFile,
	clearStorage,
	goToOptions
} from "../../popup/index";
import jsyaml from "js-yaml";
import locales from "./locales";
import { debounce } from "lodash";

const { Option } = Select;
const { TextArea } = Input;

export default class Translation extends Component {
	state = {
		sourceContent: "",
		targetContent: "",
		dataKey: "",
		toLang: "",
	};

	componentDidMount() {
		if (selectedElement() && selectedElement().text) {
			const { toLang } = this.state;
			console.log("selectElement", selectedElement());
			translation(
				{ text: selectedElement().text, to: toLang || "en" },
				selectedElement().dataKey,
				(result) => this.handleChange(result, "targetContent")
			);
			this.setState({
				sourceContent: selectedElement().text,
				dataKey: selectedElement().dataKey,
			});
		}
	}

	exportYaml = () => {
		exportFile((data) => {
			const blob = new Blob([jsyaml.dump(data["zh-CN"])], {
				type: "application/x-yaml",
			});
			saveAs(blob, "file.yaml");
		});
	};

	checkImport = () => {
		exportFile((data) => {
			console.log("check", data);
		});
	};

	saveEdit = () => {
		const { targetContent, dataKey } = this.state;
		if (dataKey) {
			setStorage("zh-CN", { [dataKey]: targetContent });
		}
	};

	debounceChange = debounce((value, type) => {
		const { toLang } = this.state;
		type === "sourceContent" &&
			translation(
				{ text: value, to: toLang || "en" },
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
		const { sourceContent, targetContent, toLang } = this.state;

		const uploadProps = {
			name: "file",
			// action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
			headers: {
				authorization: "authorization-text",
			},
			showUploadList: false,
			onChange(info) {
				if (info.file.status !== "uploading") {
				}
				if (info.file.status === "done") {
					let reader = new FileReader();
					reader.readAsText(info.file.originFileObj, "utf-8");
					reader.onload = function (e) {
						var yaml = e.target.result;
						let jsonData = jsyaml.load(yaml);
						setStorage("zh-CN", jsonData);
					};
				} else if (info.file.status === "error") {
					console.log(`${info.file.name} file upload failed.`);
				}
			},
		};

		return (
			<div className={styles.tlContainer}>
				<div className={styles.tlHeader}>
					<h2>翻译</h2>
					{/* <Button onClick={() => clearStorage()}>清空缓存</Button>
					<Button onClick={this.checkImport}>查看导入</Button> */}
					{/* <Button onClick={() => goToOptions()}>设置</Button> */}
				</div>
				<div className={styles.tlBody}>
					<div className={styles.sourceContent}>
						<TextArea
							rows={4}
							id="sourceContent"
							value={sourceContent}
							placeholder="输入要翻译的单词或句子"
							onChange={(e) =>
								this.handleChange(
									e.target.value,
									"sourceContent"
								)
							}
						/>
					</div>
					<div className={styles.selectLanguage}>
						<Select
							defaultValue={toLang}
							style={{ width: 280 }}
							placeholder="目标翻译语言(默认en)"
							onChange={(value) =>
								this.changeLang(value, "toLang")
							}
						>
							<Option value="">自动判断</Option>
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
					<div className={styles.targetContent}>
						<TextArea
							rows={4}
							id="targetContent"
							value={targetContent}
							placeholder="翻译结果"
							onChange={(e) =>
								this.handleChange(
									e.target.value,
									"targetContent"
								)
							}
						/>
					</div>
					{/* 这里还有一个用处， 没有这个 targetContent 的输入会有问题 */}
					<div className={styles.chooseYaml}>
						<Select
							size="small"
							placeholder="请选择导出的语言包"
							style={{ width: 280 }}
						>
							<Option value="zh-CN">中文</Option>
							<Option value="en">英文</Option>
						</Select>
					</div>
				</div>
				<div className={styles.tlAction}>
					<Upload id="importElement" {...uploadProps}>
						<Button>
							<Icon type="import" />
							导入
						</Button>
					</Upload>
					<Button onClick={this.exportYaml}>
						<Icon type="export" />
						导出
					</Button>
					<Button onClick={this.saveEdit}>
						<Icon type="save" />
						保存
					</Button>
				</div>
			</div>
		);
	}
}
