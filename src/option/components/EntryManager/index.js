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

const { Option } = Select;
const { Search } = Input;

export default class EntryManager extends React.Component {
	state = {
		data: [],
		visible: false,
		field: "",
		entry: "",
		selectFile: "",
		fileList: [],
	};

	componentDidMount() {
		getStorage("fileList", (items) => {
			this.setState({
				fileList: items || [],
			});
		});
	}

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
		if (!value) {
			getStorage("", "", (items) => {
				this.setState({
					data: items,
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
		let data = [...this.state.data];
		this.editData(data, record, e.target.value);
		console.log("data", data);
		this.setState({
			data,
		});

		setStorage("zh-CN", data);
	};

	handleDelete = (record) => {
		const data = this.deleteData(this.state.data, record);
		console.log("data", data);
		this.setState({
			data,
		});
		setStorage("zh-CN", data);
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
		if (!this.state.selectFile) {
			message.info("请选择要导出的文件");
		}
		exportFile((data) => {
			const blob = new Blob([jsyaml.dump(data["zh-CN"])], {
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
		const { data, field, entry } = this.state;
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

		setStorage("zh-CN", newData);
	};

	handleCancel = (e) => {
		this.setState({
			visible: false,
		});
	};

	changeFile = (value) => {
		getStorage(value, (items) => {
			this.setState({
				data: items,
				selectFile: value,
			});
		});
	};

	render() {
		const { data, visible, field, entry, fileList } = this.state;

		console.log("fileList", fileList);

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
						setStorage(info.file.name, jsonData);
						setStorage("fileList", [...fileList, info.file.name]);
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
			</div>
		);
	}
}
