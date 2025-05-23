"""Program Change

Revision ID: ab30ef2e3131
Revises: e76958c57413
Create Date: 2025-04-25 14:36:42.165401

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ab30ef2e3131'
down_revision = 'e76958c57413'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('program', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', sa.String(length=50), nullable=False))
        batch_op.add_column(sa.Column('is_deleted', sa.Boolean(), nullable=True))
        batch_op.add_column(sa.Column('deleted_at', sa.DateTime(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('program', schema=None) as batch_op:
        batch_op.drop_column('deleted_at')
        batch_op.drop_column('is_deleted')
        batch_op.drop_column('status')

    # ### end Alembic commands ###
