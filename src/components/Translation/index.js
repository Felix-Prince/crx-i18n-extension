import React, { Component } from "react";
import styles from "./index.module.css";
import { Select, Input, Button, Icon } from "antd";
import { translation } from "../../popup/index";

const { Option } = Select;
const { TextArea } = Input;

export default class Translation extends Component {
	state = {
		sourceContent: "",
		targetContent: "",
    };

	translationHandle = async () => {
		const { sourceContent } = this.state;
		translation(sourceContent);
	};

	handleChange = (e, type) => {
		this.setState({
			[type]: e.target.value,
		});
	};

	render() {
		const { sourceContent, targetContent } = this.state;
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
					<Button>
						<Icon type="import" />
						导入
					</Button>
					<Button>
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
