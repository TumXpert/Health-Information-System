"""Initial migration

Revision ID: bc3f615a028f
Revises: 
Create Date: 2025-04-24 16:41:10.097215

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bc3f615a028f'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('client',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('full_name', sa.String(length=100), nullable=False),
    sa.Column('gender', sa.String(length=10), nullable=True),
    sa.Column('date_of_birth', sa.Date(), nullable=True),
    sa.Column('phone_number', sa.String(length=15), nullable=True),
    sa.Column('address', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('program',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('enrollment',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('client_id', sa.String(length=36), nullable=False),
    sa.Column('program_id', sa.Integer(), nullable=False),
    sa.Column('enrollment_date', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['client_id'], ['client.id'], ),
    sa.ForeignKeyConstraint(['program_id'], ['program.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('enrollment')
    op.drop_table('program')
    op.drop_table('client')
    # ### end Alembic commands ###
