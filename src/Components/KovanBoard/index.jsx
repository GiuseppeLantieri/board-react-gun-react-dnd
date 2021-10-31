import React, { useState, useEffect } from 'react'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import Gun from 'gun'
import SEA from 'gun/sea';
import { useParams } from 'react-router';

const gun = Gun(process.env.REACT_APP_GUN_RELAY);

const columnsFromBackend = {
	[uuid()]: {
		name: "Requested",
		items: []
	},
	[uuid()]: {
		name: "To do",
		items: []
	},
	[uuid()]: {
		name: "In Progress",
		items: []
	},
	[uuid()]: {
		name: "Done",
		items: []
	}
};
export default function KovanBoard() {
	const { id } = useParams();
	const [columns, setColumns] = useState(columnsFromBackend);

	useEffect(() => {
		(async () => {
			gun.get(id).get('data').once(async ele => {
				console.log(ele);
				if (ele != undefined) {
					const decrypted = await SEA.decrypt(ele, process.env.REACT_APP_SECRET);
					setColumns(decrypted)
				}
			});
		})();
	}, [])

	const onDragEnd = (result, columns, setColumns) => {
		if (!result.destination) return;
		const { source, destination } = result;

		if (source.droppableId !== destination.droppableId) {
			const sourceColumn = columns[source.droppableId];
			const destColumn = columns[destination.droppableId];
			const sourceItems = [...sourceColumn.items];
			const destItems = [...destColumn.items];
			const [removed] = sourceItems.splice(source.index, 1);
			destItems.splice(destination.index, 0, removed);
			setColumns({
				...columns,
				[source.droppableId]: {
					...sourceColumn,
					items: sourceItems
				},
				[destination.droppableId]: {
					...destColumn,
					items: destItems
				}
			});
		} else {
			const column = columns[source.droppableId];
			const copiedItems = [...column.items];
			const [removed] = copiedItems.splice(source.index, 1);
			copiedItems.splice(destination.index, 0, removed);
			setColumns({
				...columns,
				[source.droppableId]: {
					...column,
					items: copiedItems
				}
			});
		}
	};

	return (
		<div>

			<h1>{id}</h1>
			<div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
				<DragDropContext
					onDragEnd={result => onDragEnd(result, columns, setColumns)}
				>
					{Object.entries(columns).map(([columnId, column], index) => {
						return (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center"
								}}
								key={columnId}
							>
								<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
									<button style={{ width: "30px", height: "30px", borderRadius: "30px" }} onClick={() => {
										let aux = columns;
										delete aux[columnId];
										setColumns({
											...aux
										});
									}}>-</button>
									<input type="text" value={column.name} onChange={(e) => {
										let value = e.currentTarget.value
										let aux = column;
										aux.name = value;
										setColumns({
											...columns,
											[columnId]: aux
										});
									}} />
									<button style={{ width: "30px", height: "30px", borderRadius: "30px" }} onClick={() => {
										let aux = column;
										aux.items.push({ id: uuid(), content: "empty" })
										setColumns({
											...columns,
											[columnId]: aux
										});
									}}>+</button>
								</div>
								<div style={{ margin: 8 }}>
									<Droppable droppableId={columnId} key={columnId}>
										{(provided, snapshot) => {
											return (
												<div
													{...provided.droppableProps}
													ref={provided.innerRef}
													style={{
														background: snapshot.isDraggingOver
															? "lightblue"
															: "lightgrey",
														padding: 4,
														width: 250,
														minHeight: 500
													}}
												>
													{column.items.map((item, index) => {
														return (
															<Draggable
																key={item.id}
																draggableId={item.id}
																index={index}
															>
																{(provided, snapshot) => {
																	return (
																		<div
																			ref={provided.innerRef}
																			{...provided.draggableProps}
																			{...provided.dragHandleProps}
																			style={{
																				userSelect: "none",
																				padding: 16,
																				margin: "0 0 8px 0",
																				minHeight: "50px",
																				backgroundColor: snapshot.isDragging
																					? "#263B4A"
																					: "#456C86",
																				color: "white",
																				...provided.draggableProps.style
																			}}
																		>
																			<button style={{ width: "30px", height: "30px", borderRadius: "30px" }} onClick={() => {
																				let aux = column;
																				aux.items = aux.items.filter(ele => (ele.id !== item.id));
																				console.log(aux, item.id)
																				setColumns({
																					...columns,
																					[columnId]: aux
																				});
																			}}>-</button>
																			<input type="text" value={item.content} onChange={(e) => {
																				let value = e.currentTarget.value
																				let aux = column;
																				aux.items = aux.items.filter(ele => (ele.id !== item.id));
																				aux.items.push({ id: item.id, content: value });
																				setColumns({
																					...columns,
																					[columnId]: aux
																				});
																			}} />
																		</div>
																	);
																}}
															</Draggable>
														);
													})}
													{provided.placeholder}
												</div>
											);
										}}
									</Droppable>
								</div>
							</div>
						);
					})}
				</DragDropContext>
				<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
					<button style={{ width: "100px", height: "30px" }} onClick={() => {
						setColumns({
							...columns,
							[uuid()]: {
								name: "Empty",
								items: []
							}
						});
					}}>
						Add Column
					</button>
					<button style={{ width: "100px", height: "30px" }} onClick={async () => {
						const encrypted = await SEA.encrypt(JSON.stringify(columns), process.env.REACT_APP_SECRET);
						gun.get(id).get("data").put(encrypted)
					}}>
						Save
					</button>
				</div>
			</div>
		</div>
	)
}
