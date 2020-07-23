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
} from "../../popup/index";
import jsyaml from "js-yaml";

const { Option } = Select;
const { TextArea } = Input;

export default class Translation extends Component {
	state = {
		sourceContent: "",
		targetContent: "",
	};

	componentDidMount() {
		if (selectedElement() && selectedElement().text) {
			getStorage(selectedElement().dataKey, () => {
				translation(selectedElement().text);
			});
			// if (localStorage.getItem("data")) {
			// 	const data = JSON.parse(localStorage.getItem("data"));
			// 	const dataKey = selectedElement().dataKey;
			// 	if (data[dataKey]) {
			// 		this.setState({
			// 			targetContent: data[dataKey],
			// 		});
			// 	} else {
			// 		translation(selectedElement().text);
			// 	}
			// } else {
			// 	translation(selectedElement().text);
			// }
			this.setState({
				sourceContent: selectedElement().text,
			});
		}
	}

	exportYaml = () => {
		exportFile((data) => {
			const blob = new Blob([jsyaml.dump(data)], { type: "application/x-yaml" });
			saveAs(blob, "file.yaml");
		});
	};

	translationHandle = async () => {
		const { sourceContent } = this.state;
		translation(sourceContent);
	};

	handleChange = (e, type) => {
		this.setState({
			[type]: e.target.value,
		});
		translation(e.target.value);
	};

	render() {
		const { sourceContent, targetContent } = this.state;

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
						// let jsonData = JSON.stringify(jsyaml.load(yaml));
						setStorage(jsonData);
						// localStorage.setItem("data", jsonData);
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
					{/* <Select defaultValue="lucy" style={{ width: 120 }}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled" disabled>
                            Disabled
                        </Option>
                        <Option value="Yiminghe">yiminghe</Option>
                    </Select> */}
				</div>
				<div className={styles.tlBody}>
					<div className={styles.sourceContent}>
						<TextArea
							rows={4}
							id="sourceContent"
							value={sourceContent}
							placeholder="输入要翻译的单词或句子"
							onChange={(e) =>
								this.handleChange(e, "sourceContent")
							}
						/>
					</div>
					<hr />
					<div className={styles.targetContent}>
						<TextArea
							rows={4}
							disabled
							id="targetContent"
							value={targetContent}
						/>
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
					<Button onClick={this.translationHandle}>
						<Icon type="save" />
						保存
					</Button>
				</div>
			</div>
		);
	}
}
