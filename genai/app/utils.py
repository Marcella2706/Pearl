from rich.console import Console
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langgraph.graph import START, END

rich = Console()

def process_chunks(chunk):
    node_name = list(chunk.keys())[0]
    
    if node_name == START or node_name == END:
        return

    node_output = chunk[node_name]

    if not isinstance(node_output, dict):
        return

    if "messages" in node_output:
        messages = node_output["messages"]
        if not isinstance(messages, list):
            messages = [messages]
        
        for message in messages:
            if isinstance(message, AIMessage):
                rich.print(f"\nAgent:\n{message.content}", style="black on white")
                
    elif "prediction" in node_output:
        final_nodes_with_prediction = ["HeartNode", "WoundNode", "ChestXRayNode"]
        if node_name in final_nodes_with_prediction:
            rich.print(f"\nAgent:\n{node_output['prediction']}", style="black on white")
            
async def process_checkpoints(checkpoints):
    rich.print("\n================ FINAL CHECKPOINT ================\n")

    checkpoints_list = []
    async for checkpoint_tuple in checkpoints:
        checkpoints_list.append(checkpoint_tuple)

    if not checkpoints_list:
        rich.print("[red]No checkpoints found.[/red]")
        return
        
    checkpoint_tuple = checkpoints_list[-1]
    
    checkpoint = checkpoint_tuple.checkpoint
    messages = checkpoint["channel_values"].get("messages", [])

    rich.print(f"[white]Checkpoint:[/white]")
    rich.print(f"[black]Timestamp: {checkpoint['ts']}[/black]")
    rich.print(f"[black]Checkpoint ID: {checkpoint['id']}[/black]")

    for message in messages:
        if isinstance(message, HumanMessage):
            rich.print(
                f"[bright_magenta]User: {message.content}[/bright_magenta] [bright_cyan](Message ID: {message.id})[/bright_cyan]"
            )
        elif isinstance(message, AIMessage):
            rich.print(
                f"[bright_magenta]Agent: {message.content}[/bright_magenta] [bright_cyan](Message ID: {message.id})[/bright_cyan]"
            )

    rich.print("\n==================================================\n")