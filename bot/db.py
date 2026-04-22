import click
from main import init_db

@click.group()
def cli():
    pass

@cli.command("init-db")
def init_db_command():
    init_db()
    print("Initialized database.")

if __name__ == "__main__":
    cli()
