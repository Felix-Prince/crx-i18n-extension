// 词条管理
/*global saveAs*/
import React from "react";
import {
	Table,
	Select,
	Button,
	Input,
	Form,
	Modal,
	Upload,
	Icon,
	message,
} from "antd";
import { getStorage, setStorage, exportFile, clearStorage } from "../../option";
import jsyaml from "js-yaml";
import styles from "./index.module.css";
import locales from "./locales";

const { Option } = Select;
const { Search } = Input;

export default class EntryManager extends React.Component {
	state = {
		data: [],
		visible: false,
		importVisible: false,
		field: "",
		entry: "",
		selectFile: "",
		fileList: [],
		importFileList: [],
		filteLanguage: "zh-CN",
		importLanguage: "",
	};

	componentDidMount() {
		// 初始默认获取中文包
		this.getFileList("zh-CN", "fileList");
	}

	getFileList = (lang) => {
		getStorage(lang, (items) => {
			this.setState({
				fileList: items.fileList || [],
			});
		});
	};

	columns = [
		{
			title: "字段",
			dataIndex: "key",
			key: "key",
		},
		{
			title: "词条",
			dataIndex: "entry",
			key: "entry",
			render: (text, record) =>
				text && (
					<Input
						value={text}
						onChange={(e) => this.handleChange(e, record)}
					/>
				),
		},
		{
			title: "操作",
			key: "action",
			render: (text, record) => (
				<span>
					<a onClick={() => this.handleDelete(record)}>删除</a>
				</span>
			),
		},
	];

	handleSearch = (value) => {
		const { filteLanguage, selectFile } = this.state;
		if (!value) {
			getStorage(filteLanguage, (items) => {
				this.setState({
					data: items[selectFile],
				});
			});
		} else {
			const data = this.searchData(this.state.data, value);
			this.setState({
				data,
			});
		}
	};

	handleChange = (e, record) => {
		const { filteLanguage, fileList, selectFile } = this.state;
		let data = [...this.state.data];
		this.editData(data, record, e.target.value);
		console.log("data", data);
		this.setState({
			data,
		});

		setStorage(filteLanguage, { [selectFile]: data, fileList });
	};

	handleDelete = (record) => {
		const { filteLanguage, fileList, selectFile } = this.state;
		const data = this.deleteData(this.state.data, record);
		console.log("data", data);
		this.setState({
			data,
		});
		setStorage(filteLanguage, { [selectFile]: data, fileList });
	};

	editData = (data, record, value) => {
		for (let index = 0; index < data.length; index++) {
			const element = data[index];
			if (element.key === record.key) {
				element.entry = value;
				break;
			}
			if (element.children) {
				this.editData(element.children, record, value);
			}
		}
	};

	deleteData = (data, record) => {
		const newData = data.filter((item) => {
			if (item.key === record.key) {
				return false;
			}
			if (item.children) {
				item.children = this.deleteData(item.children, record);
			}
			return true;
		});
		return newData;
	};

	searchData = (data, value) => {
		const newData = data.filter((item) => {
			if (item.children) {
				item.children = this.searchData(item.children, value);
			}
			if (item.entry && item.entry.includes(value)) {
				return true;
			}
			if (item.children && item.children.length > 0) {
				return true;
			}

			return false;
		});
		return newData;
	};

	exportYaml = () => {
		const { selectFile, filteLanguage } = this.state;
		if (!selectFile) {
			message.info("请选择要导出的文件");
		}
		exportFile(filteLanguage, selectFile, (data) => {
			const blob = new Blob([jsyaml.dump(data)], {
				type: "application/x-yaml",
			});
			saveAs(blob, this.state.selectFile);
		});
	};

	checkImport = () => {
		exportFile((data) => {
			console.log("check", data);
		});
	};

	handleOk = (e) => {
		const {
			data,
			field,
			entry,
			filteLanguage,
			fileList,
			selectFile,
		} = this.state;
		const newData = [...data];
		const obj = {
			key: field,
			entry,
		};
		newData.unshift(obj);
		this.setState({
			visible: false,
			data: newData,
		});

		setStorage(filteLanguage, { [selectFile]: data, fileList });
	};

	handleCancel = (e) => {
		this.setState({
			visible: false,
		});
	};

	changeFile = (value) => {
		const { filteLanguage } = this.state;
		getStorage(filteLanguage, (items) => {
			this.setState({
				data: items[value],
				selectFile: value,
			});
		});
	};

	handleImportLanguage = (lang) => {
		this.setState({
			importLanguage: lang,
		});
		this.getFileList(lang, "importFileList");
	};

	handleFilterLang = (lang) => {
		this.setState({
			filteLanguage: lang,
		});
		this.getFileList(lang, "fileList");
	};

	render() {
		const {
			data,
			visible,
			importVisible,
			field,
			entry,
			fileList,
			importLanguage,
			filteLanguage,
			importFileList,
		} = this.state;

		console.log("fileList", fileList);

		const uploadProps = {
			name: "file",
			// action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
			headers: {
				authorization: "authorization-text",
			},
			showUploadList: false,
			beforeUpload() {
				return !!importLanguage;
			},
			onChange(info) {
				if (info.file.status !== "uploading") {
				}
				if (info.file.status === "done") {
					let reader = new FileReader();
					reader.readAsText(info.file.originFileObj, "utf-8");
					reader.onload = function (e) {
						var yaml = e.target.result;
						let jsonData = jsyaml.load(yaml);
						setStorage(
							importLanguage,
							{
								[info.file.name]: jsonData,
								fileList: [...importFileList, info.file.name],
							},
							"import"
						);
						// setStorage(info.file.name, jsonData);
						// setStorage("fileList", [...fileList, info.file.name]);
						window.history.go(0);
					};
				} else if (info.file.status === "error") {
					console.log(`${info.file.name} file upload failed.`);
				}
			},
		};

		return (
			<div>
				<div className={styles.optionHeader}>
					<div>
						请选择语言：
						<Select
							defaultValue={filteLanguage}
							style={{ width: 300 }}
							placeholder="请选择导入文件的语言"
							onChange={(value) => this.handleFilterLang(value)}
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
						请选择 yaml 文件：
						<Select
							style={{ width: 300 }}
							placeholder="请选择文件"
							onChange={this.changeFile}
						>
							{fileList.map((item) => (
								<Option value={item} key={item}>
									{item}
								</Option>
							))}
						</Select>
					</div>

					<Search
						placeholder="请输入词条关键字"
						onSearch={this.handleSearch}
						style={{ width: 300 }}
					/>
					<div className={styles.optionBtns}>
						<Button
							onClick={() =>
								this.setState({ importVisible: true })
							}
						>
							<Icon type="import" />
							导入
						</Button>

						<Button onClick={this.exportYaml}>
							<Icon type="export" />
							导出
						</Button>
						<Button onClick={() => clearStorage()}>清空缓存</Button>
						<Button onClick={this.checkImport}>查看导入</Button>
						<Button
							type="primary"
							onClick={() => this.setState({ visible: true })}
						>
							添加词条
						</Button>
					</div>
				</div>
				<Table columns={this.columns} dataSource={data} />,
				<Modal
					title="添加词条"
					visible={visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
				>
					<Form.Item label="字段">
						<Input
							placeholder="请输入字段不要重复"
							value={field}
							onChange={(e) =>
								this.setState({ field: e.target.value })
							}
						/>
					</Form.Item>
					<Form.Item label="词条">
						<Input
							placeholder="请输入词条用于显示"
							value={entry}
							onChange={(e) =>
								this.setState({ entry: e.target.value })
							}
						/>
					</Form.Item>
				</Modal>
				<Modal title="导入文件" visible={importVisible} footer={null}>
					<Form.Item label="选择语言">
						<Select
							defaultValue={importLanguage}
							style={{ width: 300 }}
							placeholder="请选择导入文件的语言"
							onChange={(value) =>
								this.handleImportLanguage(value)
							}
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
					</Form.Item>
					<Form.Item label="选择文件">
						<Upload id="importElement" {...uploadProps}>
							<Button>导入</Button>
						</Upload>
					</Form.Item>
				</Modal>
			</div>
		);
	}
}
